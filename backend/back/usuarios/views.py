import json
import requests
from datetime import datetime

from django.conf import settings
from django.contrib import messages
from django.contrib.auth import (
    login, authenticate, logout, get_user_model
)
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import PasswordResetForm
from django.contrib.auth.models import User
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.http import HttpResponse, JsonResponse, HttpResponseForbidden
from django.shortcuts import render, redirect, get_object_or_404
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.views.decorators.cache import never_cache
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie
from django.middleware.csrf import get_token

from .emails import notificar_actividad  # Importa la función que creamos antes
from .models import (
    Usuario, FechasSiembra, Plantacion, Siembra, 
    Actividad, EstadoActividad
)
from .forms import (
    RegistroForm, LoginForm, SetPasswordForm, UsuarioForm, 
    PlantacionForm, ActividadForm, EstadoActividadForm, EditarPerfilForm
)
import logging
logger = logging.getLogger(__name__)

@ensure_csrf_cookie
def obtener_csrf_token(request):
    csrf_token = get_token(request)  # Obtener el token CSRF
    return JsonResponse({"csrfToken": csrf_token})  # Enviar el token en la respuesta JSON





def mi_vista(request):
    messages.success(request, "¡Operación completada correctamente!")
    return redirect('nombre_de_la_url')




@login_required
def admin_dashboard_limited(request):
    ubicacion = 'Pereira'
    clima_data = obtener_clima(ubicacion)

    # Simplificar la asignación de variables relacionadas con el clima
    temperatura = clima_data.get('temperatura') if clima_data else None
    descripcion = clima_data.get('descripcion') if clima_data else None
    humedad = clima_data.get('humedad') if clima_data else None
    presion = clima_data.get('presion') if clima_data else None
    velocidad_viento = clima_data.get('velocidad_viento') if clima_data else None
    
    return render(request,'usuarios/admin_dashboard_limited.html', {
        'temperatura': temperatura,
        'descripcion': descripcion,
        'humedad': humedad,
        'presion': presion,
        'velocidad_viento': velocidad_viento,
        'ubicacion': ubicacion,
    })
    
    
@login_required
def dashboard_admin(request):
    if not request.user.is_superuser:
        return HttpResponseForbidden("No tienes permiso para acceder a esta página.")

    usuarios = Usuario.objects.all()
    total_usuarios = usuarios.count()
    total_proyectos = 5  # Ejemplo, reemplaza con lógica real

    context = {
        'user': request.user,
        'usuarios': usuarios,
        'total_usuarios': total_usuarios,
        'total_proyectos': total_proyectos,
    }
    ubicacion = 'Pereira'
    clima_data = obtener_clima(ubicacion)

    # Simplificar la asignación de variables relacionadas con el clima
    temperatura = clima_data.get('temperatura') if clima_data else None
    descripcion = clima_data.get('descripcion') if clima_data else None
    humedad = clima_data.get('humedad') if clima_data else None
    presion = clima_data.get('presion') if clima_data else None
    velocidad_viento = clima_data.get('velocidad_viento') if clima_data else None
    
    return render(request,'usuarios/admin_dashboard_limited.html', context, {
        'temperatura': temperatura,
        'descripcion': descripcion,
        'humedad': humedad,
        'presion': presion,
        'velocidad_viento': velocidad_viento,
        'ubicacion': ubicacion,
    })


@csrf_exempt 
def iniciar_sesion(request):
    if request.method == "POST":
        data = json.loads(request.body)
        form = LoginForm(data)
        
        if form.is_valid():
            email = form.cleaned_data['email']
            password = form.cleaned_data['password']
            
            user = authenticate(request, email=email, password=password)
            
            if user is not None:
                # Iniciar sesión
                login(request, user)
                
                # Respuesta JSON con estado y is_staff
                return JsonResponse({
                    'status': 200,
                    'success': True,
                    'is_staff': user.is_staff,  
                    'message': 'Inicio de sesión exitoso'
                })
            else:
                return JsonResponse({'status': 400, 'success': False, 'message': 'Datos incorrectos'})
        else:
            return JsonResponse({'status': 400, 'success': False, 'message': 'Formulario inválido. Verifica los datos ingresados.'})
    else:
        return JsonResponse({'status': 405, 'success': False, 'message': 'Método no permitido, se esperaba POST.'})



#Vista que permite la gestion de usuarios via administrador

# se debe hacer un metodo GET

@csrf_exempt
def gestion_usuarios(request):
    # Verificar autenticación y permisos
    if not request.user.is_authenticated or (not request.user.is_superuser and not request.user.is_staff):
        return JsonResponse({"error": "No tienes permiso para acceder a esta página."}, status=403)

    if request.method == 'GET':
        # Obtener los usuarios creados por el usuario actual
        usuarios = Usuario.objects.filter(admin_creator=request.user).values("id", "first_name", "email")

        logger.debug(f"Usuarios creados por {request.user.email}: {list(usuarios)}")

        return JsonResponse({"usuarios": list(usuarios)}, status=200)

    # Métodos no permitidos
    return JsonResponse({"error": "Método no permitido"}, status=405)


@csrf_exempt  
def agregar_usuario(request):

    if not request.user.is_superuser and not request.user.is_staff:
        return JsonResponse({"error": "No tienes permiso para acceder a esta página."}, status=403)

    if request.method == 'POST':
        if request.content_type != "application/json":
            return JsonResponse({"error": "Se esperaba JSON en la solicitud"}, status=400)

        try:
            data = json.loads(request.body)  
            form = RegistroForm(data)  
        except json.JSONDecodeError:
            return JsonResponse({"error": "Formato JSON inválido"}, status=400)

        if form.is_valid():
            user = form.save(commit=False)
            user.set_password(form.cleaned_data['password1'])
            user.admin_creator = request.user
            user.is_staff = False
            user.save()
            return JsonResponse({"message": "Usuario creado exitosamente", "user_id": user.id}, status=201)
        else:
            return JsonResponse({"error": "Datos inválidos", "details": form.errors}, status=400)

    return JsonResponse({"error": "Método no permitido"}, status=405)



@csrf_exempt 
@login_required
def editar_usuario(request, user_id):
    if not request.user.is_staff:
        return JsonResponse({
            'status': 403,
            'success': False,
            'message': 'No tienes permiso para acceder a esta página.'
        }, status=403)

    usuario = get_object_or_404(Usuario, id=user_id)

    if request.method == 'POST':
        try:
            # Cargar los datos del cuerpo de la solicitud (JSON)
            data = json.loads(request.body)

            # Pasar los datos al formulario
            form = UsuarioForm(data, instance=usuario)

            if form.is_valid():
                form.save()
                return JsonResponse({
                    'status': 200,
                    'success': True,
                    'message': 'Usuario actualizado exitosamente.'
                })
            else:
                errors = form.errors.as_json()
                return JsonResponse({
                'status': 400,
                'success': False,
                'message': 'Formulario inválido.',
                'errors': errors
            }, status=400)
                
        except json.JSONDecodeError:
            return JsonResponse({
                'status': 400,
                'success': False,
                'message': 'El cuerpo de la solicitud no es JSON válido.'
            }, status=400)
            
    return JsonResponse({
        'status': 405,
        'success': False,
        'message': 'Método no permitido'
    }, status=405)
    

#Vista que permite eliminar usuarios via administrador

@login_required
@csrf_exempt
def eliminar_usuario(request, user_id):
    if not request.user.is_staff:
        return JsonResponse({
            'status': 403,
            'success': False,
            'message': 'No tienes permiso para acceder a esta página.'
        }, status=403)

    usuario = get_object_or_404(Usuario, id=user_id)

    if request.method == 'DELETE':
        try:
            usuario.actividades.clear()
            usuario.plantacion = None
            FechasSiembra.objects.filter(usuario=usuario).delete()
            usuario.delete()
            return JsonResponse({
                'status': 200,
                'success': True,
                'message': f"El usuario {usuario.first_name} {usuario.last_name} ha sido eliminado exitosamente.",
                'redirect_url': 'gestion_usuarios'
            })
        except Exception as e:
            return JsonResponse({
                'status': 500,
                'success': False,
                'message': f"Ocurrió un error al eliminar el usuario: {str(e)}"
            }, status=500)
    else:
        return JsonResponse({
        "status": 405,
        "success": False,
        "message": "Método no permitido."
    }, status=405)



@csrf_exempt
def registro(request):
    if request.method == 'POST':
        try:
            # Convertir el cuerpo de la solicitud a un diccionario
            data = json.loads(request.body)
            
        except json.JSONDecodeError:
            return JsonResponse({"error": "El formato del JSON es inválido."}, status=400)

        # Pasamos los datos al formulario
        form = RegistroForm(data)

        if form.is_valid():
            # Guardar el usuario sin confirmar el commit para poder ajustar la contraseña
            user = form.save(commit=False)
            user.set_password(data.get('password1'))  # Usar la contraseña proporcionada
            user.is_staff = True  # Opcional: hacer que todos sean staff
            user.save()

            # Realizar el login automáticamente después de guardar el usuario
            login(request, user)
            print("Errores del formulario:", form.errors)  
            # Respuesta de éxito
            return JsonResponse({"message": "Registro exitoso."}, status=200)
        else:
            print("Errores del formulario:", form.errors)  
            # Si el formulario no es válido, devolver los errores en formato JSON
            return JsonResponse({"errors": form.errors}, status=400)

    # Si no es un POST, devolver un error indicando que el método no es permitido
    return JsonResponse({"message": "Método no permitido."}, status=405)

#Funcion que permite la restauracion de contraseña generando un token y enviandolo via gmail, siempre y cuando el correo registrado este asociado a una cuenta
#de google, de lo contrario,este correo no llegara.

@csrf_exempt
def password_reset_api(request):
    if request.method == "POST":
        User = get_user_model()  # Obtiene el modelo de usuario actual
        try:
            data = json.loads(request.body)
            email = data.get("email")

            if not email:
                return JsonResponse({"error": "El correo es obligatorio."}, status=400)

            try:
                user = User.objects.get(email=email)
                
                # Generar token y UID
                token = default_token_generator.make_token(user)
                uid = urlsafe_base64_encode(force_bytes(user.pk))

                # Crear enlace de restablecimiento
                reset_url = f'http://localhost:5173/password/?uid64={uid}&token={token}'

                # Enviar el correo
                subject = "Restablecimiento de contraseña"
                message = f"Hola {user.username},\n\nPara restablecer tu contraseña, haz clic en este enlace:\n\n{reset_url}\n\nSi no solicitaste este cambio, ignora este mensaje."
                send_mail(subject, message, 'tu_correo@gmail.com', [email])

                return JsonResponse({"message": "Se ha enviado un enlace de recuperación a tu correo."}, status=200)
            except User.DoesNotExist:
                return JsonResponse({"error": "No encontramos una cuenta con ese correo."}, status=404)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Datos inválidos."}, status=400)

    return JsonResponse({"error": "Método no permitido."}, status=405)


#Redireccion a la pagina mediante enlace enviado via gmail, el cual permite realizar la actualizacion de contraseña y redireccion a login.

@csrf_exempt
def reset_password(request, uidb64, token):
    if request.method != 'POST':
        return JsonResponse({
            'status': 405,
            'success': False,
            'message': 'Método no permitido. Solo se permite POST.'
        }, status=405)

    try:
        data = json.loads(request.body)
        uid = urlsafe_base64_decode(uidb64).decode()
        user = get_user_model().objects.get(pk=uid)

        if not default_token_generator.check_token(user, token):
            return JsonResponse({
                'status': 400,
                'success': False,
                'message': 'El enlace de restablecimiento de contraseña no es válido o ha expirado.'
            }, status=400)

        form = SetPasswordForm(user, data)
        if form.is_valid():
            form.save()
            return JsonResponse({
                'status': 200,
                'success': True,
                'message': 'Tu contraseña ha sido restablecida correctamente.',
            })

        return JsonResponse({
            'status': 400,
            'success': False,
            'message': 'Formulario inválido.',
            'errors': form.errors.as_json()
        }, status=400)

    except (TypeError, ValueError, OverflowError, get_user_model().DoesNotExist):
        return JsonResponse({
            'status': 400,
            'success': False,
            'message': 'El enlace de restablecimiento de contraseña no es válido o ha expirado.'
        }, status=400)
    except json.JSONDecodeError:
        return JsonResponse({
            'status': 400,
            'success': False,
            'message': 'Error en la solicitud. Asegúrate de enviar datos en formato JSON válido.'
        }, status=400)




# Función para obtener las fechas de siembra recomendadas desde una API

def obtener_clima(ubicacion):
    api_key = 'b38f3f8558d7bee2759f548984ae5505'  # Reemplaza con tu clave API
    url = f'https://api.openweathermap.org/data/2.5/weather?q={ubicacion}&appid={api_key}&units=metric'

    # Diccionario de traducciones del clima
    CLIMA_TRADUCCIONES = {
        "Clear": "Despejado",
        "Clouds": "Nublado",
        "Rain": "Lluvia",
        "Drizzle": "Llovizna",
        "Thunderstorm": "Tormenta",
        "Snow": "Nieve",
        "Mist": "Neblina",
        "Smoke": "Humo",
        "Haze": "Bruma",
        "Dust": "Polvo",
        "Fog": "Niebla",
        "Sand": "Arena",
        "Ash": "Ceniza",
        "Squall": "Chubasco",
        "Tornado": "Tornado",
        "light rain": "llovizna",
        "moderate rain": "lluvia moderada",
        "heavy intensity rain": "lluvia intensa",
        "very heavy rain": "lluvia muy intensa",
        "extreme rain": "lluvia extrema",
        "freezing rain": "lluvia helada",
        "thunderstorm": "tormenta",
        "snow": "nieve",
        "mist": "neblina",
        "drizzle": "llovizna",
        "overcast clouds": "nubes cubiertas",
        "scattered clouds": "nubes dispersas",
        "broken clouds": "nubes rotas",
        "few clouds": "pocas nubes"
    }

    try:
        response = requests.get(url)
        response.raise_for_status()  # Lanza una excepción si hay un error en la respuesta
        data = response.json()  # Convierte la respuesta a JSON

        # Verificar que los datos esperados están en la respuesta
        if "main" in data and "weather" in data:
            # Extraer la información necesaria
            temperatura = data['main']['temp']
            descripcion_ingles = data['weather'][0]['description']
            # Traducir la descripción al español
            descripcion = CLIMA_TRADUCCIONES.get(descripcion_ingles, descripcion_ingles)  # Fallback en caso de que no se encuentre
            humedad = data['main']['humidity']
            presion = data['main']['pressure']
            velocidad_viento = data['wind']['speed']
            return {
                'temperatura': temperatura,
                'descripcion': descripcion,
                'humedad': humedad,
                'presion': presion,
                'velocidad_viento': velocidad_viento
            }
        else:
            print("La respuesta no contiene los datos esperados:", data)
            return None
    except requests.exceptions.RequestException as e:
        print(f"Error al obtener datos del clima: {e}")
        return None
    
    



# Vista para mostrar todas las plantaciones
# se dee hacer un metodo GET
def plantacion(request):
    if request.method == 'GET':
        try:
            # Filtrar las plantaciones del usuario actual
            plantaciones = Plantacion.objects.filter(usuario=request.user)
            
            # Obtener los datos del clima (supongo que esta función está correctamente implementada)
            ubicacion = 'Pereira'
            clima_data = obtener_clima(ubicacion)

            # Simplificar la asignación de variables relacionadas con el clima
            temperatura = clima_data.get('temperatura') if clima_data else None
            descripcion = clima_data.get('descripcion') if clima_data else None
            humedad = clima_data.get('humedad') if clima_data else None
            presion = clima_data.get('presion') if clima_data else None
            velocidad_viento = clima_data.get('velocidad_viento') if clima_data else None

            # Crear la respuesta JSON con los datos
            plantaciones_data = list(plantaciones.values('id', 'nombre', 'descripcion', 'fecha_siembra'))
            
            # Si no tienes datos, no hagas nada
            if not plantaciones_data:
                return JsonResponse({'message': 'No hay plantaciones registradas.'}, status=404)

            response_data = {
                'plantaciones': plantaciones_data,
                'clima': {
                    'temperatura': temperatura,
                    'descripcion': TRADUCCION_CLIMA.get(descripcion, descripcion),
                    'humedad': humedad,
                    'presion': presion,
                    'velocidad_viento': velocidad_viento,
                }
            }

            return JsonResponse(response_data, status=200)
        
        except Exception as e:
            # En caso de error, devolver un mensaje de error
            error_data = {
                'status': 'error',
                'message': str(e),
            }
            return JsonResponse(error_data, status=500)
        
TRADUCCION_CLIMA = {
        "Clear": "Despejado",
        "Clouds": "Nublado",
        "Rain": "Lluvia",
        "Drizzle": "Llovizna",
        "Thunderstorm": "Tormenta",
        "Snow": "Nieve",
        "Mist": "Neblina",
        "Smoke": "Humo",
        "Haze": "Bruma",
        "Dust": "Polvo",
        "Fog": "Niebla",
        "Sand": "Arena",
        "Ash": "Ceniza",
        "Squall": "Chubasco",
        "Tornado": "Tornado",
        "light rain": "llovizna",
        "moderate rain": "lluvia moderada",
        "heavy intensity rain": "lluvia intensa",
        "very heavy rain": "lluvia muy intensa",
        "extreme rain": "lluvia extrema",
        "freezing rain": "lluvia helada",
        "thunderstorm": "tormenta",
        "snow": "nieve",
        "mist": "neblina",
        "drizzle": "llovizna",
        "overcast clouds": "nubes cubiertas",
        "scattered clouds": "nubes dispersas",
        "broken clouds": "nubes rotas",
        "few clouds": "pocas nubes"
}

def obtener_fechas_recomendadas(request):
    # Configuración de la API del clima
    API_KEY = 'b38f3f8558d7bee2759f548984ae5505'  # Reemplaza con tu clave API
    ubicacion = 'Pereira,CO'
    url = f"http://api.openweathermap.org/data/2.5/forecast?q={ubicacion}&appid={API_KEY}&units=metric"

    # Obtener datos del clima
    response = requests.get(url)
    if response.status_code != 200:
        return JsonResponse({'status': 500, 'message': 'No se pudo obtener el clima. Inténtalo de nuevo más tarde.'}, status=500)

    clima_data = response.json()
    fechas_recomendadas = []

    # Filtrar fechas con clima templado
    for pronostico in clima_data['list']:
        fecha = pronostico['dt_txt']  # Fecha en formato 'año-mes-dia h:min:seg'
        temperatura = pronostico['main']['temp']
        if 15 <= temperatura <= 25:  # Rango de clima templado
            fecha_formateada = datetime.strptime(fecha, '%Y-%m-%d %H:%M:%S').strftime('%Y-%m-%d')
            if fecha_formateada not in fechas_recomendadas:  # Evitar duplicados
                fechas_recomendadas.append(fecha_formateada)

    return JsonResponse({
        'status': 200,
        'success': True,
        'fechas_recomendadas': fechas_recomendadas
    })


@csrf_exempt
def registrar_plantacion(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        form = PlantacionForm(data)
        if form.is_valid():
            plantacion = form.save(commit=False)
            plantacion.usuario = request.user

            plantacion.save()
            return JsonResponse({
                'status': 200,
                'success': True,
                'message': 'Plantación registrada correctamente.',
                'redirect_url': '/plantaciones'
            })
        else:
            errors = form.errors.as_json()
            return JsonResponse({
                'status': 400,
                'success': False,
                'message': 'Formulario inválido.',
                'errors': errors
            }, status=400)

    return render(request, 'usuarios/registrar_plantacion.html', {'form': PlantacionForm()})


# necesita cambios con status
# Vista para registrar una nueva plantación
# @login_required
# def registrar_plantacion(request):
#     # Configuración de la API del clima
#     API_KEY = 'b38f3f8558d7bee2759f548984ae5505'  # Reemplaza con tu clave API
#     ubicacion = 'Pereira,CO'
#     url = f"http://api.openweathermap.org/data/2.5/forecast?q={ubicacion}&appid={API_KEY}&units=metric"

#     # Obtener datos del clima
#     response = requests.get(url)
#     if response.status_code != 200:
#         messages.error(request, 'No se pudo obtener el clima. Inténtalo de nuevo más tarde.')
#         return render(request, 'usuarios/registrar_plantacion.html', {'form': PlantacionForm()})

#     clima_data = response.json()
#     fechas_recomendadas = []

#     # Filtrar fechas con clima templado
#     for pronostico in clima_data['list']:
#         fecha = pronostico['dt_txt']  # Fecha en formato 'año-mes-dia h:min:seg'
#         temperatura = pronostico['main']['temp']
#         if 15 <= temperatura <= 25:  # Rango de clima templado
#             fecha_formateada = datetime.strptime(fecha, '%Y-%m-%d %H:%M:%S').strftime('%Y-%m-%d')
#             if fecha_formateada not in fechas_recomendadas:  # Evitar duplicados
#                 fechas_recomendadas.append(fecha_formateada)

#     # Obtener el clima actual
#     clima_actual_url = f"http://api.openweathermap.org/data/2.5/weather?q={ubicacion}&appid={API_KEY}&units=metric"
#     clima_actual_response = requests.get(clima_actual_url)
#     if clima_actual_response.status_code == 200:
#         clima_actual_data = clima_actual_response.json()
#         temperatura_actual = clima_actual_data['main']['temp']
#         descripcion_ingles = clima_actual_data['weather'][0]['description']
#         descripcion_actual = TRADUCCION_CLIMA.get(descripcion_ingles, descripcion_ingles)
#         humedad_actual = clima_actual_data['main']['humidity']
#         presion_actual = clima_actual_data['main']['pressure']
#         velocidad_viento_actual = clima_actual_data['wind']['speed']
#     else:
#         temperatura_actual = descripcion_actual = humedad_actual = presion_actual = velocidad_viento_actual = None

#     # solicitudes POST estoy cansadoooooo jaja erdaa con tanta cosa por hacer y nos las estoy haciendo bien por estar pensando si estás bien.
#     if request.method == 'POST':
#         form = PlantacionForm(request.POST)
#         if form.is_valid():
#             plantacion = form.save(commit=False)
#             plantacion.usuario = request.user
#             fecha_recomendada = request.POST.get('fecha_recomendada')
#             fecha_personalizada = request.POST.get('fecha_personalizada')

#             if fecha_personalizada:
#                 plantacion.fecha_siembra = fecha_personalizada
#             elif fecha_recomendada:
#                 plantacion.fecha_siembra = fecha_recomendada
#             else:
#                 return JsonResponse({
#                     'status': 400,
#                     'success': False,
#                     'message': 'Debes seleccionar una fecha de siembra.'
#                 }, status=400)

#             plantacion.save()
#             return JsonResponse({
#                 'status': 200,
#                 'success': True,
#                 'message': 'Plantación registrada correctamente.',
#                 'redirect_url': 'plantaciones'
#             })
#         else:
#             errors = form.errors.as_json()
#             return JsonResponse({
#                 'status': 400,
#                 'success': False,
#                 'message': 'Formulario inválido.',
#                 'errors': errors
#             }, status=400)

    # solicitudes GET
    # else:
    #     form = PlantacionForm()
    #     return render(request, 'usuarios/registrar_plantacion.html', {
    #         'form': form,
    #         'fechas_recomendadas': fechas_recomendadas,
    #         'temperatura': temperatura_actual,
    #         'descripcion': descripcion_actual,
    #         'humedad': humedad_actual,
    #         'presion': presion_actual,
    #         'velocidad_viento': velocidad_viento_actual,
    #         'ubicacion': ubicacion,
    #     })           

# se tine que hacer dos GET uno para el  usario normal y notro para el admitrador  
def lista_actividades(request):
    # Obtenemos todas las actividades
    actividades = Actividad.objects.all()

    # Pasamos las actividades al contexto para mostrarlas en la plantilla
    return render(request, 'usuarios/lista_actividades.html', {'actividades': actividades})


# hay que hacer cambios por que se cambio la base de datos
def cambiar_estado(request, actividad_id, nuevo_estado):
    # Verificamos si el estado es válido
    if nuevo_estado not in ['Pendiente', 'Completada', 'En Progreso']:
        return HttpResponse("Estado inválido", status=400)

    # Obtenemos la actividad correspondiente
    actividad = get_object_or_404(Actividad, id=actividad_id)

    # Creamos un nuevo registro de estado para la actividad
    EstadoActividad.objects.create(actividad=actividad, estado=nuevo_estado)

    # Redirigimos a la lista de actividades
    return redirect('lista_actividades')

#Vista que autentica al usuario ver sus actividades

# Preguntar a kenfer
#esta puede sirvir para el trabajador?
@login_required
def mis_actividades(request):
    # Obtén las actividades asociadas al usuario autenticado
    usuario = request.user
    actividades = Actividad.objects.filter(usuario=usuario)
    
    if request.method == 'POST':
        # Marcar el estado de una actividad (en base al formulario enviado)
        actividad_id = request.POST.get('actividad_id')
        estado = request.POST.get('estado')
        actividad = Actividad.objects.get(id=actividad_id)

        # Crear o actualizar el estado de la actividad
        estado_actividad = EstadoActividad.objects.create(
            actividad=actividad, estado=estado
        )
        # Redirigir de nuevo a la lista de actividades
        return redirect('mis_actividades')

    return render(request, 'mis_actividades.html', {
        'usuario': usuario,
        'actividades': actividades,
    })
    
    # Preguntarle a kenfer

#estoy hay que cambiaro
def registrar_estado_actividad(request, actividad_id):
    actividad = get_object_or_404(Actividad, id=actividad_id)
    if request.method == 'POST':
        form = EstadoActividadForm(request.POST)
        if form.is_valid():
            estado = form.save(commit=False)
            estado.actividad = actividad
            estado.save()
            return JsonResponse({
                'status': 200,
                'success': True,
                'message': 'Estado de la actividad registrado correctamente.',
                'redirect_url': 'lista_actividades'
            })
        else:
            errors = form.errors.as_json()
            return JsonResponse({
                'status': 400,
                'success': False,
                'message': 'Formulario inválido.',
                'errors': errors
            }, status=400)
    else:
        form = EstadoActividadForm()
        return render(request, 'actividades/registrar_estado_actividad.html', {'form': form, 'actividad': actividad})


# Hacer un get de las actividades completas de dicho trabaja y det de los trabajadore

@login_required
def informes(request):
    """
    Vista para mostrar los informes.
    Solo usuarios autenticados pueden acceder.
    """
    context = {
        'user': request.user,
        'message': 'Aquí puedes ver los informes generados.',
    }
    return render(request, 'usuarios/informes.html', context)



@login_required
def listar_plantaciones(request):
    plantaciones = Plantacion.objects.all()  
    return render(request, 'usuarios/plantaciones.html', {'plantaciones': plantaciones})

@csrf_exempt
def editar_plantacion(request, id):
    plantacion = get_object_or_404(Plantacion, id=id)
    if request.method == 'POST':
        data = json.loads(request.body)
        form = PlantacionForm(data, instance=plantacion)
        if form.is_valid():
            form.save()
            return JsonResponse({
                'status': 200,
                'success': True,
                'message': 'Plantación actualizada correctamente.',
                'redirect_url': 'plantaciones'
            })
        else:
            errors = form.errors.as_json()
            return JsonResponse({
                'status': 400,
                'success': False,
                'message': 'Formulario inválido.',
                'errors': errors
            }, status=400)
    else:
        form = PlantacionForm(instance=plantacion)
        



@csrf_exempt
def eliminar_plantacion(request, id):
    plantacion = get_object_or_404(Plantacion, id=id)
    if request.method == 'POST':
        try:
            plantacion.delete()
            return JsonResponse({
                'status': 200,
                'success': True,
                'message': 'Plantación eliminada correctamente.',
                'redirect_url': 'plantaciones'
            })
        except Exception as e:
            return JsonResponse({
                'status': 500,
                'success': False,
                'message': f"Ocurrió un error al eliminar la plantación: {str(e)}"
            }, status=500)
    else:
        return JsonResponse({
            'status': 405,
            'success': False,
            'message': 'Método no permitido.'
        }, status=405)
        
@csrf_exempt
def asignar_actividad(request):
    if request.method != 'POST':
        return JsonResponse({"status": "error", "message": "Método no permitido."}, status=405)

    if not request.body:
        return JsonResponse({"status": "error", "message": "No se recibió ninguna información."}, status=400)

    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({"status": "error", "message": "El formato del JSON es inválido."}, status=400)

    usuario_id = data.get("usuario_id")
    actividad = data.get("actividad")
    descripcion = data.get("descripcion")
    tiempo_estimado = data.get("tiempo_estimado")
    fecha_vencimiento = data.get("fecha_vencimiento")
    fecha = data.get("fecha")

    if not all([usuario_id, actividad, tiempo_estimado, fecha_vencimiento, fecha]):
        return JsonResponse({"status": "error", "message": "Todos los campos son obligatorios."}, status=400)

    # Normalizar formato de tiempo
    if ":" not in tiempo_estimado or tiempo_estimado.count(":") < 2:
        tiempo_estimado += ":00"

    try:
        tiempo_estimado = datetime.strptime(tiempo_estimado, '%H:%M:%S').time()
    except ValueError:
        return JsonResponse({"status": "error", "message": "El tiempo estimado debe tener el formato HH:MM:SS."}, status=400)

    # Conversión de fechas
    try:
        fecha_vencimiento = datetime.strptime(fecha_vencimiento, '%Y-%m-%d').date()
        fecha = datetime.strptime(fecha, '%Y-%m-%d').date()
    except ValueError:
        return JsonResponse({"status": "error", "message": "Formato de fecha incorrecto. Usa el formato yyyy-mm-dd."}, status=400)

    # Verificar existencia del usuario
    usuario = Usuario.objects.filter(id=usuario_id).first()
    if not usuario:
        return JsonResponse({"status": "error", "message": "El usuario no existe."}, status=400)

    # Buscar o crear el estado 'Pendiente'
    estado_actividad, _ = EstadoActividad.objects.get_or_create(estado='Pendiente')

    # Crear la actividad
    nueva_actividad = Actividad.objects.create(
        nombre_actividad=actividad,
        tiempo_estimado=tiempo_estimado,
        fecha_vencimiento=fecha_vencimiento,
        fecha=fecha,
        descripcion=descripcion,
        usuario_id=usuario.id,  # 🔹 Cambio aquí: usar ID en lugar del objeto
        estado_id=estado_actividad.id,
    )

    # Intentar enviar notificación
    try:
        notificar_actividad(usuario, nueva_actividad)
    except Exception as e:
        return JsonResponse({"status": "error", "message": f"Error al enviar notificación: {str(e)}"}, status=500)

    # Respuesta de éxito
    return JsonResponse({
        "status": "success",
        "message": "Actividad creada correctamente",
        "actividad": {
            "id": nueva_actividad.id,
            "usuario": usuario.first_name,
            "nombre_actividad": nueva_actividad.nombre_actividad,
            "descripcion": nueva_actividad.descripcion,
            "tiempo_estimado": str(nueva_actividad.tiempo_estimado),
            "fecha_vencimiento": str(nueva_actividad.fecha_vencimiento),
            "fecha": str(nueva_actividad.fecha),
            "estado": estado_actividad.estado
        }
    }, status=201)

    
    # Si la solicitud no es POST, renderizar la página de asignación de actividades




# Hacer metodo GET 


@csrf_exempt
def perfil(request):
   
    usuario = request.user  

    es_administrador = usuario.is_superuser or usuario.is_staff  

    if request.method == 'POST':

        # Permitir edición solo a administradores
        data = json.loads(request.body)  # Parseamos el cuerpo de la solicit
        # Si el usuario es administrador, permitir edición
        form = EditarPerfilForm(data, instance=usuario)
        if form.is_valid():
            form.save()
            return JsonResponse({
                'status': 200,
                'success': True,
                'message': 'Perfil actualizado correctamente.',
                'redirect_url': 'perfil'
            })
        else:
            errors = form.errors.as_json()
            return JsonResponse({
                'status': 400,
                'success': False,
                'message': 'Error al actualizar el perfil. Verifica los datos ingresados.',
                'errors': errors
            }, status=400)

    else:
        # Si es una solicitud GET, devolver solo la información permitida
        datos_usuario = {
            'first_name': usuario.first_name,
            'email': usuario.email
        }
        if es_administrador:
            datos_usuario['last_name'] = usuario.last_name  # Solo los administradores ven el apellido

        return JsonResponse({
            'status': 200,
            'success': True,
            'usuario': datos_usuario,
            'es_administrador': es_administrador,
        })

@csrf_exempt
def logout_view(request):
    logout(request)  # Esto elimina la sesión en el servidor
    return JsonResponse({
        "status": 200,
        "message": "Logout exitoso"
    })
    
    #hay que hacer las vista de el aditarr actividad y borra
        
        
        
        
        
