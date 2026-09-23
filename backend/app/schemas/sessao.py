from pydantic import BaseModel
from datetime import datetime

class SessaoBase(BaseModel):
    usuario_id: int
    duracao: int
    tentativas: int
    acertos: int
    erros: int
    pontuacao: int
    
    
    class Config:
        from_attributes = True

class SessaoResponseSchema(SessaoBase):
    id: int
    data_sessao: datetime

class SessaoCreateSchema(SessaoBase):
    pass