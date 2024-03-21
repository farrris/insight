from users.models import User

class FavoriteService:

    def get_favotires_list(self, user: User):
        return user.favorites.all()
    
    def add_favorite(self, user: User, user_id: int):
        favorite = User.objects.get(pk=user_id)
        
        user.favorites.add(favorite)

        return favorite

    def remove_favorite(self, user: User, favorite_id: int):
        user.favorites.remove(favorite_id)