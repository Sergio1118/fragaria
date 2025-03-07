# usuarios/emails.py
from django.core.mail import send_mail
from django.conf import settings

from django.core.mail import send_mail
from django.conf import settings

def notificar_actividad(usuario, actividad):
    # Componer el mensaje
    subject = 'Nueva actividad pendiente'
    
    # Cambiar 'usuario.username' por 'usuario.first_name' o 'usuario.email' según sea necesario
    message = f'Hola {usuario.first_name},\n\nSe te ha asignado una nueva actividad pendiente:\n\n' \
              f'Actividad: {actividad.nombre_actividad}\nDescripción: {actividad.descripcion}\nFecha límite: {actividad.fecha_vencimiento}\n\n' \
              'No olvides completarla a tiempo.'
    
    # Enviar el correo
    send_mail(
        subject,
        message,
        settings.EMAIL_HOST_USER,  # Remitente, el correo configurado en settings.py
        [usuario.email],  # Destinatario, el correo del usuario
        fail_silently=False,
    )
