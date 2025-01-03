from django.contrib.auth.hashers import make_password
from users.models import User
from users.schemas import CreateUserData, UpdateUserData
from ninja import File
from ninja.files import UploadedFile
from django.core.files.storage import FileSystemStorage
import uuid
import os

class UserService:
    
    def get_users_list(self):
        return User.objects.all()
    
    def create_user(self, data: CreateUserData, avatar: UploadedFile = File(...)):

        data.password = make_password(data.password)
        
        data = data.dict()

        if (avatar):
            data["avatar"] = self.upload_avatar(avatar)

        interests = data["interests"]

        del data["interests"]

        user = User.objects.create(
            **data
        )
        
        if len(interests):
            user.interests.add(*interests)

        return user
    
    def update_user(self, user: User, data: UpdateUserData):
        for attr, value in data.dict().items():
            if value:
                if attr == "interests":
                    user.interests.clear()
                    user.interests.add(*value)
                else:
                    setattr(user, attr, value)

        user.save()

        return user
    
    def upload_avatar(self, file: UploadedFile = File(...)):
        fs = FileSystemStorage()
        file_name, file_ext = os.path.splitext(file.name)
        new_filename = uuid.uuid4().hex + file_ext
        uploaded_filename = fs.save(new_filename, file)
        uploaded_file_url = fs.url(uploaded_filename)

        return uploaded_file_url