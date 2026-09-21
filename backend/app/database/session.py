from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

engine = create_engine("mysql+pymysql://root:74632132@localhost/performance_analytics")

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)