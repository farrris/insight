from django.contrib.auth.hashers import make_password
from users.models import User
from users.schemas import CreateUserData, UpdateUserData

class UserService:
    
    def get_users_list(self):
        return User.objects.all()
    
    def create_user(self, data: CreateUserData):

        data.password = make_password(data.password)
        
        data = data.dict()

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
            if attr == "interests":
                user.interests.clear()
                user.interests.add(*value)
            else:
                setattr(user, attr, value)

        user.save()

        return user