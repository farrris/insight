from interests.models import Interest
from interests.schemas import InterestOut

class InterestSerializer:

    def __init__(self, resource: Interest) -> None:
        self.resource = resource
    
    def display(self):
        return InterestOut(
            id=self.resource.pk,
            title=self.resource.title
        ).dict()