from pydantic_settings import BaseSettings


class Settings(BaseSettings):

    database_host: str = "localhost"
    database_port: int = 5432
    database_user: str = "postgres"
    database_password: str = "Md010315"
    database_name: str = "malaysia_election_intelligence"


settings = Settings()