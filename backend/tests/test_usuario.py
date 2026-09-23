import pytest
import uuid
from fastapi import HTTPException
from app.services.usuario_service import UsuarioService
from app.database.session import SessionLocal
from app.schemas.usuario import UsuarioCreateSchema
from app.models.sessao import Sessao


def test_instanciar_service():
    service = UsuarioService()
    assert service is not None

def test_criar_usuario():
    db = SessionLocal()
    try:
        email = f"joao_{uuid.uuid4()}@email.com"

        usuario_schema = UsuarioCreateSchema(
            nome="João Teste",
            email=email
        )

        usuario = UsuarioService().criar_usuario(
            db,
            usuario_schema
        )
        assert usuario.nome == "João Teste"
        assert usuario.email == email

    finally:
        db.close()

def test_email_duplicado():
    db = SessionLocal()
    try:
        email = f"joao_{uuid.uuid4()}@email.com"
        usuario_schema = UsuarioCreateSchema(
            nome="João Teste",
            email=email
        )
        UsuarioService().criar_usuario(
            db,
            usuario_schema
        )
        with pytest.raises(HTTPException) as erro:
            UsuarioService().criar_usuario(
                db,
                usuario_schema
            )
        assert erro.value.status_code == 409
        assert erro.value.detail == "Email já cadastrado"
    finally:
        db.close()

def test_buscar_usuario_inexistente():
    db = SessionLocal()
    try:
        with pytest.raises(HTTPException) as erro:
            UsuarioService().buscar_usuario_por_id(
                db,
                999999
            )
        assert erro.value.status_code == 404
        assert erro.value.detail == "Usuário não existe"
    finally:
        db.close()