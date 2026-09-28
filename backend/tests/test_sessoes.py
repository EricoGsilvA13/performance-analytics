import pytest

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from fastapi import HTTPException

from app.database.base import Base
from app.models.usuario import Usuario
from app.models.sessao import Sessao
from app.schemas.sessao import SessaoCreateSchema
from app.services.sessao_service import SessaoService


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
def sessao_service():
    return SessaoService()


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


def test_criar_sessao(
    db,
    sessao_service,
    usuario
):

    sessao = SessaoCreateSchema(
        usuario_id=usuario.id,
        duracao=120,
        tentativas=10,
        acertos=8,
        erros=2,
        pontuacao=100
    )

    resultado = sessao_service.criar_sessao(
        db,
        sessao
    )

    assert resultado.id is not None
    assert resultado.usuario_id == usuario.id
    assert resultado.duracao == 120
    assert resultado.tentativas == 10
    assert resultado.acertos == 8
    assert resultado.erros == 2
    assert resultado.pontuacao == 100


def test_criar_sessao_usuario_inexistente(
    db,
    sessao_service
):

    sessao = SessaoCreateSchema(
        usuario_id=999,
        duracao=120,
        tentativas=10,
        acertos=8,
        erros=2,
        pontuacao=100
    )

    with pytest.raises(HTTPException) as erro:

        sessao_service.criar_sessao(
            db,
            sessao
        )

    assert erro.value.status_code == 404
    assert erro.value.detail == "Usuário não encontrado"


def test_criar_sessao_tentativas_invalidas(
    db,
    sessao_service,
    usuario
):

    sessao = SessaoCreateSchema(
        usuario_id=usuario.id,
        duracao=120,
        tentativas=0,
        acertos=0,
        erros=0,
        pontuacao=100
    )

    with pytest.raises(HTTPException) as erro:

        sessao_service.criar_sessao(
            db,
            sessao
        )

    assert erro.value.status_code == 422
    assert erro.value.detail == "Números de tentativas invalidas"


def test_criar_sessao_erros_maior_que_tentativas(
    db,
    sessao_service,
    usuario
):

    sessao = SessaoCreateSchema(
        usuario_id=usuario.id,
        duracao=120,
        tentativas=10,
        acertos=1,
        erros=11,
        pontuacao=100
    )

    with pytest.raises(HTTPException) as erro:

        sessao_service.criar_sessao(
            db,
            sessao
        )

    assert erro.value.status_code == 422
    assert erro.value.detail == "Números de erros invalidas"


def test_criar_sessao_acertos_maior_que_tentativas(
    db,
    sessao_service,
    usuario
):

    sessao = SessaoCreateSchema(
        usuario_id=usuario.id,
        duracao=120,
        tentativas=10,
        acertos=11,
        erros=1,
        pontuacao=100
    )

    with pytest.raises(HTTPException) as erro:

        sessao_service.criar_sessao(
            db,
            sessao
        )

    assert erro.value.status_code == 422
    assert erro.value.detail == "Números de acertos invalidas"


def test_criar_sessao_soma_diferente_das_tentativas(
    db,
    sessao_service,
    usuario
):

    sessao = SessaoCreateSchema(
        usuario_id=usuario.id,
        duracao=120,
        tentativas=10,
        acertos=5,
        erros=2,
        pontuacao=100
    )

    with pytest.raises(HTTPException) as erro:

        sessao_service.criar_sessao(
            db,
            sessao
        )

    assert erro.value.status_code == 422
    assert erro.value.detail == "Números de tentativas invalidas"


def test_listar_sessoes(
    db,
    sessao_service,
    usuario
):

    sessao1 = SessaoCreateSchema(
        usuario_id=usuario.id,
        duracao=120,
        tentativas=10,
        acertos=8,
        erros=2,
        pontuacao=100
    )

    sessao2 = SessaoCreateSchema(
        usuario_id=usuario.id,
        duracao=180,
        tentativas=20,
        acertos=15,
        erros=5,
        pontuacao=150
    )

    sessao_service.criar_sessao(db, sessao1)
    sessao_service.criar_sessao(db, sessao2)

    sessoes = sessao_service.listar_sessoes(db)

    assert len(sessoes) == 2


def test_buscar_sessao_por_id(
    db,
    sessao_service,
    usuario
):

    sessao = SessaoCreateSchema(
        usuario_id=usuario.id,
        duracao=120,
        tentativas=10,
        acertos=8,
        erros=2,
        pontuacao=100
    )

    sessao_criada = sessao_service.criar_sessao(
        db,
        sessao
    )

    resultado = sessao_service.buscar_sessao_Id(
        db,
        sessao_criada.id
    )

    assert resultado.id == sessao_criada.id
    assert resultado.usuario_id == usuario.id
    assert resultado.pontuacao == 100


def test_buscar_sessao_inexistente(
    db,
    sessao_service
):

    with pytest.raises(HTTPException) as erro:

        sessao_service.buscar_sessao_Id(
            db,
            999
        )

    assert erro.value.status_code == 404
    assert erro.value.detail == "Sessão não encontrado"


def test_excluir_sessao(
    db,
    sessao_service,
    usuario
):

    sessao = SessaoCreateSchema(
        usuario_id=usuario.id,
        duracao=120,
        tentativas=10,
        acertos=8,
        erros=2,
        pontuacao=100
    )

    sessao_criada = sessao_service.criar_sessao(
        db,
        sessao
    )

    resultado = sessao_service.excluir_sessao(
        db,
        sessao_criada.id
    )

    assert resultado == {
        "mensagem": "Sessão excluida"
    }

    sessao_buscada = db.query(Sessao).filter(
        Sessao.id == sessao_criada.id
    ).first()

    assert sessao_buscada is None


def test_excluir_sessao_inexistente(
    db,
    sessao_service
):

    with pytest.raises(HTTPException) as erro:

        sessao_service.excluir_sessao(
            db,
            999
        )

    assert erro.value.status_code == 404
    assert erro.value.detail == "Sessão não encontrada"

