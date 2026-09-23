from fastapi import FastAPI

app = FastAPI()

from app.routes.usuario import usuario_router
from app.routes.sessao import sessao_router
from app.routes.estatistica import estatistica_router


app.include_router(usuario_router)
app.include_router(sessao_router)
app.include_router(estatistica_router)

#cd backend
#uvicorn app.main:app --reload