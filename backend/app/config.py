from pydantic import field_validator
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str
    frontend_origin: str = "http://localhost:5173"

    @field_validator("database_url", mode="before")
    @classmethod
    def use_psycopg_driver(cls, value):
        if isinstance(value, str) and value.startswith("postgresql://"):
            return value.replace("postgresql://", "postgresql+psycopg://", 1)

        return value

    class Config:
        env_file = ".env"


settings = Settings()
