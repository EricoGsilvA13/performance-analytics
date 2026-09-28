import pytest

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from fastapi import HTTPException

from app.database.base import Base
from app.models.usuario import Usuario
from app.models.sessao import Sessao
from app.schemas.usuario import UsuarioCreateSchema, UsuarioUpdateSchema
from app.services.usuario_service import UsuarioService


# Banco SQLite somente para os testes
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
def usuario_service():
    return UsuarioService()


def test_criar_usuario(db, usuario_service):

    usuario = UsuarioCreateSchema(
        nome="Erico",
        email="erico@email.com"
    )

    resultado = usuario_service.criar_usuario(
        db,
        usuario
    )

    assert resultado.id is not None
    assert resultado.nome == "Erico"
    assert resultado.email == "erico@email.com"


def test_criar_usuario_email_duplicado(db, usuario_service):

    usuario = UsuarioCreateSchema(
        nome="Erico",
        email="erico@email.com"
    )

    usuario_service.criar_usuario(
        db,
        usuario
    )

    with pytest.raises(HTTPException) as erro:

        usuario_service.criar_usuario(
            db,
            usuario
        )

    assert erro.value.status_code == 409
    assert erro.value.detail == "Email já cadastrado"


def test_listar_usuarios(db, usuario_service):

    usuario1 = UsuarioCreateSchema(
        nome="Erico",
        email="erico@email.com"
    )

    usuario2 = UsuarioCreateSchema(
        nome="Joao",
        email="joao@email.com"
    )

    usuario_service.criar_usuario(db, usuario1)
    usuario_service.criar_usuario(db, usuario2)

    usuarios = usuario_service.listar_usuarios(db)

    assert len(usuarios) == 2


def test_buscar_usuario_por_id(db, usuario_service):

    usuario = UsuarioCreateSchema(
        nome="Erico",
        email="erico@email.com"
    )

    usuario_criado = usuario_service.criar_usuario(
        db,
        usuario
    )

    resultado = usuario_service.buscar_usuario_por_id(
        db,
        usuario_criado.id
    )

    assert resultado.id == usuario_criado.id
    assert resultado.nome == "Erico"
    assert resultado.email == "erico@email.com"


def test_buscar_usuario_inexistente(db, usuario_service):

    with pytest.raises(HTTPException) as erro:

        usuario_service.buscar_usuario_por_id(
            db,
            999
        )

    assert erro.value.status_code == 404
    assert erro.value.detail == "Usuário não existe"


def test_atualizar_usuario(db, usuario_service):

    usuario = UsuarioCreateSchema(
        nome="Erico",
        email="erico@email.com"
    )

    usuario_criado = usuario_service.criar_usuario(
        db,
        usuario
    )

    usuario_atualizado = UsuarioUpdateSchema(
        nome="Erico Silva",
        email="ericosilva@email.com"
    )

    resultado = usuario_service.atualizar_usuario(
        db,
        usuario_atualizado,
        usuario_criado.id
    )

    assert resultado.nome == "Erico Silva"
    assert resultado.email == "ericosilva@email.com"


def test_atualizar_usuario_inexistente(db, usuario_service):

    usuario_atualizado = UsuarioUpdateSchema(
        nome="Erico Silva",
        email="ericosilva@email.com"
    )

    with pytest.raises(HTTPException) as erro:

        usuario_service.atualizar_usuario(
            db,
            usuario_atualizado,
            999
        )

    assert erro.value.status_code == 404
    assert erro.value.detail == "Usuário não existe"


def test_atualizar_usuario_email_de_outro_usuario(
    db,
    usuario_service
):

    usuario1 = UsuarioCreateSchema(
        nome="Erico",
        email="erico@email.com"
    )

    usuario2 = UsuarioCreateSchema(
        nome="Joao",
        email="joao@email.com"
    )

    usuario_criado1 = usuario_service.criar_usuario(
        db,
        usuario1
    )

    usuario_service.criar_usuario(
        db,
        usuario2
    )

    usuario_atualizado = UsuarioUpdateSchema(
        nome="Erico Silva",
        email="joao@email.com"
    )

    with pytest.raises(HTTPException) as erro:

        usuario_service.atualizar_usuario(
            db,
            usuario_atualizado,
            usuario_criado1.id
        )

    assert erro.value.status_code == 409
    assert erro.value.detail == "Email já existe"


def test_deletar_usuario(db, usuario_service):

    usuario = UsuarioCreateSchema(
        nome="Erico",
        email="erico@email.com"
    )

    usuario_criado = usuario_service.criar_usuario(
        db,
        usuario
    )

    resultado = usuario_service.deletar_usuario(
        db,
        usuario_criado.id
    )

    assert resultado == {
        "message": "Usuário removido com sucesso"
    }

    usuario = db.query(Usuario).filter(
        Usuario.id == usuario_criado.id
    ).first()

    assert usuario is None


def test_deletar_usuario_inexistente(db, usuario_service):

    with pytest.raises(HTTPException) as erro:

        usuario_service.deletar_usuario(
            db,
            999
        )

    assert erro.value.status_code == 404
    assert erro.value.detail == "Usuário não existe"