from sqlalchemy import Integer, String, TIMESTAMP, Column
from app.database.base import Base
from sqlalchemy.orm import relationship

class Usuario(Base):
    __tablename__ = "usuario"

    id = Column(Integer, primary_key=True)
    nome = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, nullable=False)
    data_criacao = Column(TIMESTAMP, nullable=False)
    
    sessoes = relationship("Sessao", back_populates="usuario")