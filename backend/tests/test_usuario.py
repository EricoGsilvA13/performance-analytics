from app.services.usuario_service import UsuarioService
from app.schemas.usuario import UsuarioCreateSchema


def test_criar_usuario():

    usuario_schema = UsuarioCreateSchema(
        nome="Érico",
        email="erico@email.com"
    )

    service = UsuarioService()

    # futuramente vamos passar o banco de teste aqui