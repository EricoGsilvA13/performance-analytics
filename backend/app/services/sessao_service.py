from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.sessao import Sessao
from app.models.usuario import Usuario
from app.schemas.sessao import SessaoCreateSchema

class SessaoService:
    def criar_sessao(self, db: Session, sessao_schema: SessaoCreateSchema):
        
        usuario_valido = db.query(Usuario).filter(Usuario.id == sessao_schema.usuario_id).first()

        if not usuario_valido:
            raise HTTPException(status_code=404, detail="Usuário não encontrado")

        if sessao_schema.tentativas <= 0:
            raise HTTPException(status_code=422, detail="Números de tentativas invalidas")
        
        if sessao_schema.erros > sessao_schema.tentativas:
            raise HTTPException(status_code=422, detail="Números de erros invalidas")

        if sessao_schema.acertos > sessao_schema.tentativas:
            raise HTTPException(status_code=422, detail="Números de acertos invalidas")

        if sessao_schema.acertos + sessao_schema.erros != sessao_schema.tentativas:
            raise HTTPException(status_code=422, detail="Números de tentativas invalidas")
        
        nova_sessao = Sessao(
            usuario_id=sessao_schema.usuario_id,
            duracao=sessao_schema.duracao,
            tentativas=sessao_schema.tentativas,
            acertos=sessao_schema.acertos,
            erros=sessao_schema.erros,
            pontuacao=sessao_schema.pontuacao
        )

        db.add(nova_sessao)
        db.commit()
        db.refresh(nova_sessao)

        return nova_sessao

    def listar_sessoes(self, db: Session):

        sessoes = db.query(Sessao).all()

        return sessoes
    
    def buscar_sessao_Id(self, db: Session, sessao_id: int):

        sessao_buscada = db.query(Sessao).filter(Sessao.id == sessao_id).first()

        if not sessao_buscada:
            raise HTTPException(status_code=404, detail="Sessão não encontrado")

        return sessao_buscada
    
    def excluir_sessao(self, db: Session, sessao_id: int):

        sessao_excluida = db.query(Sessao).filter(Sessao.id == sessao_id).first()

        if not sessao_excluida:
            raise HTTPException(status_code=404, detail="Sessão não encontrada")

        db.delete(sessao_excluida)
        db.commit()

        return {"mensagem":"Sessão excluida"}