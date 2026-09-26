from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

from app.routes.usuario import usuario_router
from app.routes.sessao import sessao_router
from app.routes.estatistica import estatistica_router


app.include_router(usuario_router)
app.include_router(sessao_router)
app.include_router(estatistica_router)

app.add_middleware(
CORSMiddleware,
allow_origins=[
"http://localhost:5173",
"http://127.0.0.1:5173",
],
allow_credentials=True,
allow_methods=[""],
allow_headers=[""],
)

#cd backend
#uvicorn app.main:app --reload
#cd frontend
#npm run dev