from app.database.connection import engine
from sqlalchemy.orm import sessionmaker



SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)