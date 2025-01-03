from ninja_extra import api_controller, route
from interests.service import InterestService
from interests.serializers import InterestSerializer
from interests.schemas import InterestOut

@api_controller("/interests/", tags=["Интересы"])
class InterestController:

    def __init__(self) -> None:
        self.service = InterestService()
        
    @route.get("/", response={200:list[InterestOut]})
    def get_interests(self):
        interests = self.service.get_all_interests()
        return [InterestSerializer(interest).display() for interest in interests]

    