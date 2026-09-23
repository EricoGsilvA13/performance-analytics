from fastapi import APIRouter, Depends
from app.schemas.usuario import UsuarioCreateSchema, UsuarioUpdateSchema
from app.services.usuario_service import UsuarioService
from app.database.session import SessionLocal
from sqlalchemy.orm import Session

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/usuarios")
def criar_usuario(usuario_schema: UsuarioCreateSchema, db: Session = Depends(get_db)):

    novo_usuario = UsuarioService().criar_usuario(db, usuario_schema)
    
    return novo_usuario

@router.get("/usuarios")
def listar_usuarios(db: Session = Depends(get_db)):

    usuarios = UsuarioService().listar_usuarios(db)

    return usuarios
#GET/usuarios/{id}
@router.get("/usuarios/{usuario_id}")
def buscar_usuario(usuario_id: int, db: Session = Depends(get_db)):

    usuario = UsuarioService().buscar_usuario_por_id(db, usuario_id)

    return usuario
#PUT/usuarios/{id}
@router.put("/usuarios/{usuario_id}")
def atualizar_usuario(usuario_schema: UsuarioUpdateSchema, usuario_id:int, db: Session = Depends(get_db)):

    usuario_atualizado = UsuarioService().atualizar_usuario(db, usuario_schema, usuario_id)

    return usuario_atualizado
#DELETE/usuarios/{id}
@router.delete("/usuarios/{usuario_id}")
def deletar_usuario(usuario_id: int, db: Session = Depends(get_db)):

    UsuarioService().deletar_usuario(db, usuario_id)

    return {"mensagem":"Usuario excluido"}