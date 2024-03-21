import enum

class UserGenderEnum(str, enum.Enum):

    MALE = "Мужской"
    FEMALE = "Женский"

class FamilyStatusEnum(str, enum.Enum):
    NOT_MARRIED = "Не женат"
    MARRIED = "Женат"
    IN_LOVE = "Влюблён"
    DATING = "Встречается"
    IN_SEARCH = "В активном поиске"
    COMPLICATED = "Всё сложно"