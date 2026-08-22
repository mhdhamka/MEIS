from pydantic_settings import BaseSettings


class Settings(BaseSettings):

    database_host: str = "localhost"
    database_port: int = 3306
    database_user: str = "root"
    database_password: str = ""
    database_name: str = "malaysia_election_intelligence"


settings = Settings()