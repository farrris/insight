from users.schemas import UserOut, UserShortOut
from users.models import User
from interests.serializers import InterestSerializer

from django.contrib.auth.models import AnonymousUser

class UserSerializer:

    def __init__(self, resource: User, user: User = AnonymousUser) -> None:
        self.resource = resource
        self.user = user
    
    def display(self):

        interests = [InterestSerializer(interest).display() for interest in self.resource.interests.all()]

        if (self.user):
            is_favorite = self.resource.pk in self.user.favorites.values_list("pk", flat=True) if self.user.pk else False
        else:
            is_favorite = False


        return UserOut(
            id=self.resource.pk,
            avatar=self.resource.avatar,
            is_favorite=is_favorite,
            username=self.resource.username,
            name=self.resource.name,
            surname=self.resource.surname,
            city=self.resource.city,
            age=self.resource.age,
            gender=self.resource.gender,
            about=self.resource.about,
            interests=interests,
            registered_at=str(self.resource.registered_at),
        ).dict()
    
    def short(self):
        return UserShortOut(
            id=self.resource.pk,
            avatar=self.resource.avatar,
            username=self.resource.username,
            name=self.resource.name,
            surname=self.resource.surname
        ).dict()