from fastapi import APIRouter, Depends
from app.database.session import SessionLocal
from app.schemas.sessao import SessaoCreateSchema, SessaoResponseSchema
from app.services.sessao_service import SessaoService
from sqlalchemy.orm import Session

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
#POST/sessao/
@router.post("/sessoes")
def criar_sessao(sessao_schema: SessaoCreateSchema, db: Session = Depends(get_db)):

    nova_sessao = SessaoService().criar_sessao(db, sessao_schema)

    return nova_sessao
#GET/sessao/
@router.get("/sessoes")
def listar_sessao(db: Session = Depends(get_db)):

    sessao_listadas = SessaoService().listar_sessoes(db)

    return sessao_listadas
#GET/sessao/{id}
@router.get("/sessoes/{sessao_id}")
def buscar_sessao(sessao_id: int, db: Session = Depends(get_db)):

    sessao_buscada = SessaoService().buscar_sessao_Id(db, sessao_id)

    return sessao_buscada
#DELETE/sessao/{id}
@router.delete("/sess/{sessao_id}")
def excluir_sessao(sessao_id: int, db: Session = Depends(get_db)):

    sessao_excluida = SessaoService().excluir_sessao(db, sessao_id)

    return sessao_excluida