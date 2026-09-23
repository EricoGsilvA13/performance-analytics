from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import SessionLocal
from app.services.estatistica_service import EstatisticaService


router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


#GET/estatistica/sessao/{sessao_id}
@router.get("/estatisticas/sessao/{sessao_id}")
def estatistica_sessao(sessao_id: int,db: Session = Depends(get_db)):
    resultado = EstatisticaService().calcular_estatistica_sessao(db, sessao_id)
    return resultado
#GET/estatistica/sessao/{usuario_id}
@router.get("/estatisticas/usuario/{usuario_id}")
def estatistica_usuario(usuario_id: int, db:Session = Depends(get_db)):
    resultado = EstatisticaService().calcular_estatistica_usuario(db,usuario_id)
    return resultado