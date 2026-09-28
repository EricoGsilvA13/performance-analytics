import pytest

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from fastapi import HTTPException

from app.database.base import Base
from app.models.usuario import Usuario
from app.models.sessao import Sessao
from app.services.estatistica_service import EstatisticaService


# Banco SQLite exclusivo para os testes
DATABASE_URL = "sqlite:///:memory:"

engine_test = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}
)

SessionTest = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine_test
)


@pytest.fixture
def db():
    Base.metadata.create_all(bind=engine_test)

    session = SessionTest()

    yield session

    session.close()
    Base.metadata.drop_all(bind=engine_test)


@pytest.fixture
def estatistica_service():
    return EstatisticaService()


@pytest.fixture
def usuario(db):
    novo_usuario = Usuario(
        nome="Erico",
        email="erico@email.com"
    )

    db.add(novo_usuario)
    db.commit()
    db.refresh(novo_usuario)

    return novo_usuario


def criar_sessao(
    db,
    usuario_id,
    duracao,
    tentativas,
    acertos,
    erros,
    pontuacao
):
    sessao = Sessao(
        usuario_id=usuario_id,
        duracao=duracao,
        tentativas=tentativas,
        acertos=acertos,
        erros=erros,
        pontuacao=pontuacao
    )

    db.add(sessao)
    db.commit()
    db.refresh(sessao)

    return sessao


def test_calcular_estatistica_sessao(
    db,
    estatistica_service,
    usuario
):

    sessao = criar_sessao(
        db=db,
        usuario_id=usuario.id,
        duracao=120,
        tentativas=10,
        acertos=8,
        erros=2,
        pontuacao=100
    )

    resultado = estatistica_service.calcular_estatistica_sessao(
        db,
        sessao.id
    )

    assert resultado.sessao_id == sessao.id
    assert resultado.taxa_acerto == 80
    assert resultado.taxa_erro == 20


def test_calcular_estatistica_sessao_inexistente(
    db,
    estatistica_service
):

    with pytest.raises(HTTPException) as erro:

        estatistica_service.calcular_estatistica_sessao(
            db,
            999
        )

    assert erro.value.status_code == 404
    assert erro.value.detail == "Sessão não encontrada"


def test_calcular_estatistica_usuario(
    db,
    estatistica_service,
    usuario
):

    criar_sessao(
        db=db,
        usuario_id=usuario.id,
        duracao=120,
        tentativas=10,
        acertos=8,
        erros=2,
        pontuacao=100
    )

    criar_sessao(
        db=db,
        usuario_id=usuario.id,
        duracao=180,
        tentativas=20,
        acertos=15,
        erros=5,
        pontuacao=150
    )

    resultado = estatistica_service.calcular_estatistica_usuario(
        db,
        usuario.id
    )

    # Total:
    # tentativas = 30
    # acertos = 23
    # erros = 7
    #
    # taxa de acerto = 23 / 30 * 100 = 76.666...
    # taxa de erro = 7 / 30 * 100 = 23.333...

    assert resultado.usuario_id == usuario.id
    assert resultado.taxa_acerto == pytest.approx(76.6666666667)
    assert resultado.taxa_erro == pytest.approx(23.3333333333)


def test_calcular_estatistica_usuario_sem_sessao(
    db,
    estatistica_service,
    usuario
):

    with pytest.raises(HTTPException) as erro:

        estatistica_service.calcular_estatistica_usuario(
            db,
            usuario.id
        )

    assert erro.value.status_code == 404
    assert erro.value.detail == "Usuario não encontrado"


def test_calcular_estatistica_usuario_inexistente(
    db,
    estatistica_service
):

    with pytest.raises(HTTPException) as erro:

        estatistica_service.calcular_estatistica_usuario(
            db,
            999
        )

    assert erro.value.status_code == 404
    assert erro.value.detail == "Usuario não encontrado"
