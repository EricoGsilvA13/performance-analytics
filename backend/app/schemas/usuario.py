from pydantic import BaseModel
from datetime import datetime

class UsuarioBase(BaseModel):
    nome: str
    email: str

    class Config:
        from_attributes = True

class UsuarioCreateSchema(UsuarioBase):
    pass

class UsuarioResponseSchema(UsuarioBase):
    id: int
    data_criacao: datetime

class UsuarioUpdateSchema(UsuarioBase):
    pass
