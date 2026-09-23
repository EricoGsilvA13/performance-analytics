from pydantic import BaseModel

class EstatisticaBaseSchema(BaseModel):
    taxa_acerto: float
    taxa_erro: float

    class Config:
        from_attributes = True

class EstatisticaSessaoSchema(EstatisticaBaseSchema):
    sessao_id: int

class EstatisticaUsuarioSchema(EstatisticaBaseSchema):
    usuario_id:int