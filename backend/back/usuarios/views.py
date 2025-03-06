from django.contrib.auth import login, authenticate
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from .forms import RegistroForm, LoginForm
from django.core.mail import send_mail
from django.contrib.auth.forms import PasswordResetForm
from django.shortcuts import get_object_or_404
from django.contrib.auth.tokens import default_token_generator
from django.contrib.auth.models import User
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from .forms import SetPasswordForm 
from django.contrib.auth import get_user_model
from .forms import UsuarioForm  
from django.http import HttpResponseForbidden
from .models import Usuario
import requests
from django.http import JsonResponse
from datetime import datetime
from .models import Plantacion, Siembra
from .forms import PlantacionForm, RegistroForm
from .models import Usuario, FechasSiembra
from django.shortcuts import render, redirect
from .models import Actividad, EstadoActividad
from .forms import ActividadForm, EstadoActividadForm
from django.views.decorators.cache import never_cache
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.tokens import default_token_generator
from django.contrib.auth.models import User
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.core.mail import send_mail
from django.views.decorators.csrf import csrf_exempt
import json
from django.views.decorators.csrf import csrf_exempt 
from django.contrib.auth import get_user_model
from django.views.decorators.csrf import ensure_csrf_cookie
from django.middleware.csrf import get_token

@ensure_csrf_cookie
def obtener_csrf_token(request):
    csrf_token = get_token(request)  # Obtener el token CSRF
    return JsonResponse({"csrfToken": csrf_token})  # Enviar el token en la respuesta JSON

def inicio(request):
    return render(request), #'usuarios/base.html'  # Plantilla de dashboard principal

#Funcion que valida el tipo de ingreso como credenciales dependiendo el acceso

def mi_vista(request):
    # Después de alguna acción, como guardar un formulario
    messages.success(request, "¡Operación completada correctamente!")
    return redirect('nombre_de_la_url')




def user_info(request):
    if not request.user.is_authenticated:
        return JsonResponse({"error": "No autenticado"}, status=401)  # ✅ Evita la redirección a /accounts/login/

    return JsonResponse({
        "id": request.user.id,
        "email": request.user.email,
        "is_staff": request.user.is_staff,  # ✅ Enviar si es admin o no
        "first_name": request.user.first_name,
        "last_name": request.user.last_name
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
                
                # Respuesta JSON con estado y `is_staff`
                return JsonResponse({
                    'status': 200,
                    'success': True,
                    'is_staff': user.is_staff,  # ✅ Aquí enviamos si es admin o no
                    'message': 'Inicio de sesión exitoso'
                })
            else:
                return JsonResponse({'status': 400, 'success': False, 'message': 'Datos incorrectos'})
        else:
            return JsonResponse({'status': 400, 'success': False, 'message': 'Formulario inválido. Verifica los datos ingresados.'})
    else:
        return JsonResponse({'status': 405, 'success': False, 'message': 'Método no permitido, se esperaba POST.'})


# def iniciar_sesion(request):
#     if request.method == "POST":
#         data = json.loads(request.body)
#         email= data.get("email")
#         password = data.get("password")
        
#         user = authenticate(request, email=email, password=password)
#         if user:
#             login(request, user)  # Inicia sesión
#             return JsonResponse({
#                 "message": "Login exitoso",
#                 "user_id": user.id,
#                 "is_admin": user.is_superuser,
#                 "is_staff": user.is_staff
#             }, status=200)
#         else:
#             return JsonResponse({"error": "Credenciales inválidas"}, status=400)

#     return JsonResponse({"error": "Método no permitido"}, status=405)


# def iniciar_sesion(request):
#     if request.method == 'POST':
#         data = json.loads(request.body)
#         form = LoginForm(data)
        
#         if form.is_valid():
#             email = form.cleaned_data['email']
#             password = form.cleaned_data['password']
            
#             user = authenticate(request, email=email, password=password)
            
#             if user is not None:
#                 # Iniciar sesión
#                 login(request, user)
                
#                 # Respuesta JSON con el estado y la redirección
#                 if user.is_superuser:
#                     return JsonResponse({'status': 200, 'success': True, 'redirect_url': 'dashboard_admin'})
#                 elif user.is_staff:
#                     return JsonResponse({'status': 200, 'success': True, 'redirect_url': 'admin_dashboard_limited'})
#                 else:
#                     return JsonResponse({'status': 200, 'success': True, 'redirect_url': 'inicio'})
#             else:
#                 return JsonResponse({'status': 400, 'success': False, 'message': 'Datos incorrectos'})
#         else:
#             return JsonResponse({'status': 400, 'success': False, 'message': 'Formulario inválido. Verifica los datos ingresados.'})
#     else:
#         return JsonResponse({'status': 405, 'success': False, 'message': 'Método no permitido, se esperaba POST.'})



@login_required
def admin_dashboard_limited(request):
    return render(request, 'usuarios/admin_dashboard_limited.html')


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
    return render(request, 'usuarios/admin_dashboard_limited.html', context)

#Se verifica si el login cuenta con credenciales creadas mediante superUser, si es el caso, se valida y tiene acceso a los empleados 
#Modificar login y dejar solo uno 

def login_admin(request):
    if request.method == 'POST':
        form = LoginForm(request.POST)
        if form.is_valid():
            user = form.get_user()
            if user.is_staff:  # Verificamos si es un administrador
                login(request, user)
                messages.success(request, "Bienvenido administrador.")
                #return redirect('gestion_usuarios')  # Redirige al panel de administración
            else:
                messages.error(request, "No tienes permisos de administrador.")
                #return redirect('login')  # Redirige a login si no es admin
    else:
        form = LoginForm()  # Si el método no es POST, creamos un formulario vacío
    
    #return render(request, 'usuarios/login.html', {'form': form})

#Vista que permite la gestion de usuarios via administrador


@login_required
def gestion_usuarios(request):
    if not request.user.is_superuser and not request.user.is_staff:
        return HttpResponseForbidden("No tienes permiso para acceder a esta página.")

    usuarios = Usuario.objects.filter(admin_creator = request.user)  # Obtén todos los usuarios

    #return render(request, 'usuarios/gestion_usuarios.html', {'usuarios': usuarios})


#Vista que permite agregar usuarios via administrador

@csrf_exempt  # 👈 Desactivar CSRF solo para pruebas en Postman (Opcional)
def agregar_usuario(request):
    print("Usuario autenticado:", request.user)
    print("Es superusuario:", request.user.is_superuser)
    print("Es staff:", request.user.is_staff)

    if not request.user.is_superuser and not request.user.is_staff:
        return JsonResponse({"error": "No tienes permiso para acceder a esta página."}, status=403)

    if request.method == 'POST':
        # ✅ Verifica si la solicitud viene en JSON
        if request.content_type != "application/json":
            return JsonResponse({"error": "Se esperaba JSON en la solicitud"}, status=400)

        try:
            data = json.loads(request.body)  # 📌 Leer el JSON enviado
            form = RegistroForm(data)  # Pasar los datos al formulario
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

#Vista que permite editar usuarios via administrador


@login_required
def editar_usuario(request, user_id):
    if not request.user.is_staff:
        return HttpResponseForbidden()  # Si no es admin, denegar acceso

    usuario = get_object_or_404(Usuario, id=user_id)

    if request.method == 'POST':
        form = UsuarioForm(request.POST, instance=usuario)
        if form.is_valid():
            form.save()
            messages.success(request, "Usuario actualizado exitosamente.")
            return redirect('gestion_usuarios')  # Redirigir al panel de administración
    else:
        form = UsuarioForm(instance=usuario)

    return render(request, 'usuarios/editar_usuario.html', {'form': form, 'usuario': usuario})


#Vista que permite eliminar usuarios via administrador


@login_required
def eliminar_usuario(request, user_id):
    if not request.user.is_staff:
        return HttpResponseForbidden()  # Si no es admin, denegar acceso

    usuario = get_object_or_404(Usuario, id=user_id)

    if request.method == 'POST':
        try:
            # Eliminar las relaciones de ManyToMany y otras claves foráneas si es necesario
            usuario.actividades.clear()  # Elimina las relaciones de ManyToMany
            usuario.plantacion = None  # Si tienes una relación ForeignKey

            # Eliminar relaciones relacionadas en otras tablas
            # Asegúrate de eliminar explícitamente las relaciones en la tabla `usuarios_fechasiembra`
            FechasSiembra.objects.filter(usuario=usuario).delete()

            # Ahora, proceder a eliminar el usuario
            usuario.delete()

            # Mostrar mensaje de éxito
            messages.success(request, f"El usuario {usuario.first_name} {usuario.last_name} ha sido eliminado exitosamente.")
        except Exception as e:
            # En caso de error al eliminar
            messages.error(request, f"Ocurrió un error al eliminar el usuario: {e}")

        return redirect('gestion_usuarios')  # Cambia 'gestion_usuarios' al nombre de la vista correcta

    return render(request, 'usuarios/eliminar_usuario.html', {'usuario': usuario})

#Vista que permite el registro para nuevos empleados u usuarios de la app

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
@csrf_exempt  # SOLO en desarrollo
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
                reset_url = f'http://localhost:5173/password/?token={token}&uid={uid}'

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



# def agregar_usuario(request):
#     # Descomentar y habilitar este bloque si deseas restringir el acceso solo a superusuarios o usuarios staff
#     # if not request.user.is_superuser and not request.user.is_staff:
#     #     return HttpResponseForbidden("No tienes permiso para acceder a esta página.")

#     if request.method == 'POST':
#         form = RegistroForm(request.POST)

#         if form.is_valid():
#             user = form.save(commit=False)
#             user.set_password(form.cleaned_data['password1'])  # Establecer la contraseña de forma segura
#             user.admin_creator = request.user  # Registrar al usuario que creó este nuevo usuario
#             user.is_staff = False  # Establecer el usuario como no staff
#             user.save()
#             messages.success(request, "Usuario creado exitosamente.")
#             return redirect('gestion_usuarios')  # Redirigir a la página de gestión de usuarios
#     else:
#         form = RegistroForm()  # Si no es POST, mostrar el formulario vacío
    
#     return render(request, 'usuarios/agregar_usuario.html', {'form': form})


# #Vista que permite editar usuarios via administrador


# @login_required
# def editar_usuario(request, user_id):
#     if not request.user.is_staff:
#         return HttpResponseForbidden()  # Si no es admin, denegar acceso

#     usuario = get_object_or_404(Usuario, id=user_id)

#     if request.method == 'POST':
#         form = UsuarioForm(request.POST, instance=usuario)
#         if form.is_valid():
#             form.save()
#             messages.success(request, "Usuario actualizado exitosamente.")
#             return redirect('gestion_usuarios')  # Redirigir al panel de administración
#     else:
#         form = UsuarioForm(instance=usuario)

#     return render(request, 'usuarios/editar_usuario.html', {'form': form, 'usuario': usuario})


# #Vista que permite eliminar usuarios via administrador


# @login_required
# def eliminar_usuario(request, user_id):
#     if not request.user.is_staff:
#         return HttpResponseForbidden()  # Si no es admin, denegar acceso

#     usuario = get_object_or_404(Usuario, id=user_id)

#     if request.method == 'POST':
#         try:
#             # Eliminar las relaciones de ManyToMany y otras claves foráneas si es necesario
#             usuario.actividades.clear()  # Elimina las relaciones de ManyToMany
#             usuario.plantacion = None  # Si tienes una relación ForeignKey

#             # Eliminar relaciones relacionadas en otras tablas
#             # Asegúrate de eliminar explícitamente las relaciones en la tabla `usuarios_fechasiembra`
#             FechasSiembra.objects.filter(usuario=usuario).delete()

#             # Ahora, proceder a eliminar el usuario
#             usuario.delete()

#             # Mostrar mensaje de éxito
#             messages.success(request, f"El usuario {usuario.first_name} {usuario.last_name} ha sido eliminado exitosamente.")
#         except Exception as e:
#             # En caso de error al eliminar
#             messages.error(request, f"Ocurrió un error al eliminar el usuario: {e}")

#         return redirect('gestion_usuarios')  # Cambia 'gestion_usuarios' al nombre de la vista correcta

#     return render(request, 'usuarios/eliminar_usuario.html', {'usuario': usuario})

# #Vista que permite el registro para nuevos empleados u usuarios de la app



# def registro(request):
#     if request.method == 'POST':
#         form = RegistroForm(request.POST)
#         if form.is_valid():
#             user = form.save(commit=False)
#             user.set_password(form.cleaned_data['password1'])
#             user.is_staff = True  # Todos los usuarios son staff (administradores)
#             user.save()
#             login(request, user)
#             messages.success(request, "Registro exitoso.")
#             return redirect('login')
#     else:
#         form = RegistroForm()
#     return render(request, 'usuarios/registro.html', {'form': form})


# #Funcion que permite la restauracion de contraseña generando un token y enviandolo via gmail, siempre y cuando el correo registrado este asociado a una cuenta
# #de google, de lo contrario,este correo no llegara.

# def password_reset(request):
#     if request.method == 'POST':
#         form = PasswordResetForm(request.POST)
#         if form.is_valid():
#             email = form.cleaned_data.get('email')
            
#             try:
#                 user = User.objects.get(email=email)
                
#                 # Generar un token de restablecimiento
#                 token = default_token_generator.make_token(user)
                
#                 # Codificar el ID de usuario
#                 uid = urlsafe_base64_encode(user.pk.encode())
                
#                 # Crear el enlace de restablecimiento
#                 reset_url = f'http://127.0.0.1:8000/reset_password/{uid}/{token}/'  # Enlace de restablecimiento
                
#                 # Configurar el mensaje del correo
#                 subject = 'Solicitud de restablecimiento de contraseña'
#                 message = f'Hola {user.username},\n\nHemos recibido una solicitud para restablecer tu contraseña. Si no fuiste tú, ignora este mensaje. Si deseas restablecerla, haz clic en el siguiente enlace:\n\n{reset_url}\n\nSaludos.'
#                 from_email = 'tu_correo@gmail.com'  # Cambia este correo por el que desees usar
#                 recipient_list = [email]

#                 # Enviar el correo
#                 send_mail(subject, message, from_email, recipient_list)

#                 messages.success(request, "Te hemos enviado un correo para restablecer tu contraseña.")
#                 return redirect('password_reset_done')
#             except User.DoesNotExist:
#                 messages.error(request, "No encontramos ninguna cuenta con ese correo electrónico.")
#                 return redirect('password_reset')

#     else:
#         form = PasswordResetForm()

#     return render(request, 'usuarios/password_reset.html', {'form': form})


#Redireccion a la pagina mediante enlace enviado via gmail, el cual permite realizar la actualizacion de contraseña y redireccion a login.

def reset_password(request, uidb64, token):
    try:
        # Decodificar el uid
        uid = urlsafe_base64_decode(uidb64).decode()
        user = get_user_model().objects.get(pk=uid)
        
        # Verificar si el token es válido
        if default_token_generator.check_token(user, token):
            if request.method == 'POST':
                form = SetPasswordForm(user, request.POST)
                if form.is_valid():
                    form.save()
                    messages.success(request, 'Tu contraseña ha sido restablecida correctamente.')
                    return redirect('login')  # Redirige a la página de inicio de sesión
            else:
                form = SetPasswordForm(user)
            
            return render(request, 'usuarios/reset_password.html', {'form': form})
        else:
            messages.error(request, 'El enlace de restablecimiento de contraseña no es válido o ha expirado.')
            return redirect('password_reset')
    except (TypeError, ValueError, OverflowError, user.DoesNotExist):
        messages.error(request, 'El enlace de restablecimiento de contraseña no es válido o ha expirado.')
        return redirect('password_reset')

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

def seleccion_siembra(request):
    # Lista de fechas recomendadas
    fechas_recomendadas = [
        "2024-01-15",
        "2024-02-20",
        "2024-03-10",
        "2024-04-05",
        "2024-05-12",
    ]

    ubicacion = 'Pereira'  # Cambia esto por la ciudad deseada
    clima_data = obtener_clima(ubicacion)

    if clima_data:
        temperatura = clima_data['temperatura']
        descripcion = clima_data['descripcion']
        humedad = clima_data['humedad']
        presion = clima_data['presion']
        velocidad_viento = clima_data['velocidad_viento']
    else:
        temperatura = descripcion = humedad = presion = velocidad_viento = None

    return render(request, 'usuarios/siembra.html', {
        'fechas_recomendadas': fechas_recomendadas,
        'temperatura': temperatura,
        'descripcion': descripcion,
        'humedad': humedad,
        'presion': presion,
        'velocidad_viento': velocidad_viento,
        'ubicacion': ubicacion,
    })

# Vista para mostrar todas las plantaciones
@login_required
def plantacion(request):
    plantaciones = Plantacion.objects.all()  # Obtener todas las plantaciones
    return render(request, 'usuarios/plantaciones.html', {'plantaciones': plantaciones})

@login_required
def lista_plantaciones(request):
    plantaciones = Plantacion.objects.filter(usuario=request.user)  # Filtra las plantaciones por el usuario logueado
    return render(request, 'lista_plantaciones.html', {'plantaciones': plantaciones})

# Vista para registrar una nueva plantación
@login_required
def registrar_plantacion(request):
    if request.method == 'POST':
        form = PlantacionForm(request.POST)
        if form.is_valid():
            # Crear la plantación sin guardarla aún
            plantacion = form.save(commit=False)
            
            # Asignar el usuario logueado a la plantación
            plantacion.usuario = request.user
            
            # Ahora guarda la plantación
            plantacion.save()

            # Mensaje de éxito
            messages.success(request, 'Plantación registrada correctamente.')
            return redirect('plantacion')  # Redirige a la vista que muestra las plantaciones
    else:
        form = PlantacionForm()
    
    return render(request, 'usuarios/registrar_plantacion.html', {'form': form})

# Vista para registrar una actividad
def registrar_actividad(request):
    if request.method == 'POST':
        form = ActividadForm(request.POST)
        if form.is_valid():
            actividad = form.save()  # Guarda la actividad
            # Crear el estado de la actividad como "Pendiente"
            estado = EstadoActividad(estado="Pendiente", actividad=actividad)
            estado.save()
            return redirect('lista_actividades')  # Redirige a la lista de actividades o cualquier otra vista
    else:
        form = ActividadForm()
    
    return render(request, 'registrar_actividad.html', {'form': form})

# Vista para listar todas las actividades
def lista_actividades(request):
    actividades = Actividad.objects.all()  # Obtén todas las actividades
    return render(request, 'usuarios/lista_actividades.html', {'actividades': actividades})

# Vista para registrar el estado de una actividad
def registrar_estado_actividad(request, actividad_id):
    actividad = Actividad.objects.get(id=actividad_id)  # Obtiene la actividad por ID
    if request.method == 'POST':
        form = EstadoActividadForm(request.POST)
        if form.is_valid():
            estado = form.save(commit=False)
            estado.actividad = actividad  # Relaciona el estado con la actividad
            estado.save()
            return redirect('lista_actividades')  # Redirige a la lista de actividades
    else:
        form = EstadoActividadForm()

    return render(request, 'actividades/registrar_estado_actividad.html', {'form': form, 'actividad': actividad})

def cronograma(request):
    # Aquí puedes filtrar las actividades según la fecha, el estado, etc.
    actividades = Actividad.objects.all()  # O filtra según algún criterio específico, como fechas

    context = {
        'actividades': actividades,
    }
    
    return render(request, 'usuarios/cronograma.html', context)





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







