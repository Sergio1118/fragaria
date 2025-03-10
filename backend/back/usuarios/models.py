from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.conf import settings


# Manager personalizado para el Usuario
class UsuarioManager(BaseUserManager):
    def create_user(self, email, first_name, last_name, password=None):
        if not email:
            raise ValueError("El email es obligatorio")
        email = self.normalize_email(email)
        user = self.model(email=email, first_name=first_name, last_name=last_name)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, first_name, last_name, password=None):
        user = self.create_user(email, first_name, last_name, password)
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user


# Modelo de Usuario
class Usuario(AbstractBaseUser, PermissionsMixin):
    username = models.CharField(max_length=255, null=True, blank=True)
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=True)  # Todos los usuarios son staff por defecto
    is_superuser = models.BooleanField(default=False)  # Solo algunos serán superusuarios
    
    # Relación con Plantación
    plantacion = models.ForeignKey('Plantacion', on_delete=models.SET_NULL, related_name='usuarios', null=True, blank=True)
    
    # Relación Muchos a Muchos con Actividad
    actividades = models.ManyToManyField('Actividad', blank=True, related_name='usuarios_asociados')

    # Usuario que creó este usuario (para jerarquía de permisos)
    admin_creator = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='created_users')

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    objects = UsuarioManager()

    def __str__(self):
        return f"{self.first_name} {self.last_name}"
   




   

# Modelo de Estado de Actividad
class EstadoActividad(models.Model):
    ESTADOS = [
        ('Pendiente', 'Pendiente'),
        ('Completada', 'Completada'),
        ('En Progreso', 'En Progreso'),
    ]
    estado = models.CharField(max_length=20, choices=ESTADOS, default='Pendiente')

    def __str__(self):
        return f"Estado: {self.estado}"


   

class Actividad(models.Model):
    nombre_actividad = models.CharField(max_length=50)
    tiempo_estimado = models.TimeField()
    clima_requerido = models.CharField(max_length=50, blank=True, null=True)
    fecha_vencimiento = models.DateField()
    fecha = models.DateField()
    descripcion = models.TextField()
    
    estado = models.ForeignKey(EstadoActividad, on_delete=models.CASCADE)  # 🔥 Corrección aquí
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='actividades_asignadas')

    def __str__(self):
        return self.nombre_actividad


# Modelo de Fechas de Siembra
class FechasSiembra(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    tipo_fresa = models.CharField(max_length=50)
    fecha = models.DateField()

    def __str__(self):
        return f"{self.tipo_fresa} - {self.fecha}"


# Modelo de Plantación
class Plantacion(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(null=True, blank=True)
    fecha_siembra = models.DateField(null=True, blank=True)
    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='plantaciones')

    def __str__(self):
        return self.nombre


# Modelo de Siembra
class Siembra(models.Model):
    nombre = models.CharField(max_length=100)
    fecha_siembra = models.DateField()

    plantacion = models.ForeignKey(Plantacion, on_delete=models.CASCADE, related_name='siembras')

    def __str__(self):
        return self.nombre


# Modelo de Rol
class Rol(models.Model):
    nombre_rol = models.CharField(max_length=50)

    def __str__(self):
        return self.nombre_rol


# Modelo de Cronograma
class Cronograma(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(default="Descripción no disponible")
    fecha = models.DateField()

    def __str__(self):
        return self.nombre


# Modelo intermedio Usuario-Cronograma
class UsuarioCronograma(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    cronograma = models.ForeignKey(Cronograma, on_delete=models.CASCADE)
    fecha = models.DateField()

    class Meta:
        db_table = 'usuarios_usuario_cronograma'  # Nombre personalizado para la tabla

    def __str__(self):
        return f"{self.usuario.first_name} - {self.cronograma.nombre}"

