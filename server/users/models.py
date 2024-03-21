from django.contrib.auth.models import AbstractBaseUser
from django.contrib.auth.models import UserManager
from django.contrib.auth.models import PermissionsMixin
from django.db import models

class User(AbstractBaseUser, PermissionsMixin):
    
    class UserGender(models.TextChoices):
        MALE = "Мужской"
        FEMALE = "Женский"

    class FamilyStatus(models.TextChoices):
        NOT_MARRIED = "Не женат"
        MARRIED = "Женат"
        IN_LOVE = "Влюблён"
        DATING = "Встречается"
        IN_SEARCH = "В активном поиске"
        COMPLICATED = "Всё сложно"

    username = models.CharField(unique=True)
    password = models.CharField()

    is_superuser = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    name = models.CharField()
    surname = models.CharField()
    city = models.CharField()
    age = models.IntegerField()
    gender = models.CharField(choices=UserGender.choices)
    family_status = models.CharField(choices=FamilyStatus.choices)
    
    interests = models.ManyToManyField("interests.Interest", related_name="users")

    registered_at = models.DateTimeField(auto_now_add=True)

    objects = UserManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.username