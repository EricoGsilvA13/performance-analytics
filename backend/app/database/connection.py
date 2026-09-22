from dotenv import load_dotenv
from sqlalchemy import create_engine
import os

load_dotenv()

usuario = os.getenv("DB_USER")
senha = os.getenv("DB_PASSWORD")
host = os.getenv("DB_HOST")
porta = os.getenv("DB_PORT")
banco = os.getenv("DB_NAME")

engine = create_engine(f"mysql+pymysql://{usuario}:{senha}@{host}:{porta}/{banco}")
