from sqlalchemy.orm import Session
from app.models.usuario import Usuario
from app.schemas.usuario import UsuarioCreateSchema, UsuarioUpdateSchema


class UsuarioService:

    def criar_usuario(self, db: Session, usuario_schema: UsuarioCreateSchema):

        usuario_existente = db.query(Usuario).filter(
            Usuario.email == usuario_schema.email
        ).first()

        if usuario_existente:
            raise ValueError("E-mail já cadastrado")


        novo_usuario = Usuario(
            nome=usuario_schema.nome,
            email=usuario_schema.email
        )


        db.add(novo_usuario)
        db.commit()
        db.refresh(novo_usuario)

        return novo_usuario

    def listar_usuarios(self, db: Session):
        
        usuarios = db.query(Usuario).all()      

        return usuarios

    def buscar_usuario_por_id(self, db: Session, usuario_id: int):

        usuario_buscado = db.query(Usuario).filter(Usuario.id == usuario_id).first()

        if not usuario_buscado:
            raise ValueError("usuário não existe")

        return usuario_buscado

    def atualizar_usuario(self, db: Session, usuario_schema: UsuarioUpdateSchema, usuario_id: int):
        
        usuario_buscado = db.query(Usuario).filter(Usuario.id == usuario_id).first()

        if not usuario_buscado:
            raise ValueError("usuário não existe")

        email_existente = db.query(Usuario).filter(Usuario.email == usuario_schema.email).first()

        if email_existente and email_existente.id != usuario_id:
            raise ValueError("email ja  existe")

        usuario_buscado.nome = usuario_schema.nome
        usuario_buscado.email = usuario_schema.email

        db.commit()
        db.refresh(usuario_buscado)

        return usuario_buscado
        
        
    def deletar_usuario(self, db: Session, usuario_id: int):

        usuario_buscado = db.query(Usuario).filter(Usuario.id == usuario_id).first()

        if not usuario_buscado:
            raise ValueError("Usuario não existe")

        db.delete(usuario_buscado)
        db.commit()

        return {"message": "Usuário removido com sucesso"}