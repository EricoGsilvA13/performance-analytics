from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
CORSMiddleware,
allow_origins=[
"http://localhost:5173",
"http://127.0.0.1:5173",
"https://performance-analytics-psi.vercel.app/",
],
allow_credentials=True,
allow_methods=[ "GET",
        "POST",
        "PUT",
        "DELETE",
        "OPTIONS",
        "PATCH",],
allow_headers=["Content-Type",
        "Authorization",],
)

from app.routes.usuario import usuario_router
from app.routes.sessao import sessao_router
from app.routes.estatistica import estatistica_router

app.include_router(usuario_router)
app.include_router(sessao_router)
app.include_router(estatistica_router)

@app.get("/")
def inicio():
    return {
        "mensagem": "Performance Analytics API",
        "status": "online"
    }
#cd backend
#uvicorn app.main:app --reload
#cd frontend
#npm run dev