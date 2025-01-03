from interests.models import Interest

class InterestService:

    def get_all_interests(self):
        return Interest.objects.all()