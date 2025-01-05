from pydantic import BaseModel

class InterestResponseSchema(BaseModel):

    id: int
    title: str

    class Config:
        
        from_attributes = True