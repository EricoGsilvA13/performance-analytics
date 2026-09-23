from sqlalchemy import Integer, TIMESTAMP, Column, ForeignKey
from app.database.base import Base
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

class Sessao(Base):
    __tablename__ = "sessao"

    id = Column(Integer, primary_key=True)
    usuario_id = Column(Integer, ForeignKey('usuario.id'), nullable=False)
    data_sessao = Column(TIMESTAMP, nullable=False, server_default=func.now())
    duracao = Column(Integer, nullable=False)
    pontuacao = Column(Integer, nullable=False)
    acertos = Column(Integer, nullable=False)
    erros = Column(Integer, nullable=False)
    tentativas = Column(Integer, nullable=False)

    usuario = relationship('Usuario', back_populates="sessoes")

