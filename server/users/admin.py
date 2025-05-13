from django.contrib import admin
from users.models import User, Post

admin.site.register(User)
admin.site.register(Post)