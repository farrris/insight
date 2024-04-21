from users.schemas import UserOut, UserShortOut
from users.models import User
from interests.serializers import InterestSerializer

class UserSerializer:

    def __init__(self, resource: User) -> None:
        self.resource = resource
    
    def display(self):

        interests = [InterestSerializer(interest).display() for interest in self.resource.interests.all()]

        return UserOut(
            id=self.resource.pk,
            username=self.resource.username,
            name=self.resource.name,
            surname=self.resource.surname,
            city=self.resource.city,
            age=self.resource.age,
            gender=self.resource.gender,
            family_status=self.resource.family_status,
            interests=interests,
            registered_at=str(self.resource.registered_at)
        ).dict()
    
    def short(self):
        return UserShortOut(
            id=self.resource.pk,
            username=self.resource.username,
            name=self.resource.name,
            surname=self.resource.surname
        ).dict()