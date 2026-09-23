from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.schemas.estatistica import EstatisticaSessaoSchema, EstatisticaUsuarioSchema
from app.models.sessao import Sessao

class EstatisticaService:
    def calcular_estatistica_sessao(self, db: Session, sessao_id:int):

        sessao_valida = db.query(Sessao).filter(Sessao.id == sessao_id).first()

        if not sessao_valida:
            raise HTTPException(status_code=404, detail="Sessão não encontrada")

        taxa_acerto = (sessao_valida.acertos/sessao_valida.tentativas)*100
        taxa_erro = (sessao_valida.erros/sessao_valida.tentativas)*100

        return EstatisticaSessaoSchema(
            sessao_id=sessao_id,
            taxa_acerto=taxa_acerto,
            taxa_erro=taxa_erro
        )
        
    def calcular_estatistica_usuario(self, db: Session, usuario_id:int):

        sessao_valida = db.query(Sessao).filter(Sessao.usuario_id == usuario_id).first()
        
        if not sessao_valida:
            raise HTTPException(status_code=404, detail="Usuario não encontrado")

        sessoes = db.query(Sessao).filter(Sessao.usuario_id == usuario_id).all()

        total_tentativas = 0
        total_erro = 0
        total_acerto = 0
        for sessao in sessoes:
            total_tentativas += sessao.tentativas
            total_acerto += sessao.acertos
            total_erro += sessao.erros

        taxa_acerto = (total_acerto/total_tentativas)*100
        taxa_erro = (total_erro/total_tentativas)*100

        return EstatisticaUsuarioSchema(
            usuario_id=usuario_id,
            taxa_acerto=taxa_acerto,
            taxa_erro=taxa_erro
        )