from django.db import models

class Interest(models.Model):

    title = models.CharField()

    def __str__(self) -> str:
        return self.title
