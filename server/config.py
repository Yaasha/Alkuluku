from dotenv import load_dotenv
import os

load_dotenv()

class Config(object):
    # Flask settings
    SECRET_KEY = os.environ.get("FLASK_SECRET", "SECRET")

    # Flask-MongoEngine settings
    MONGODB_SETTINGS = {
        'db': 'alkuluku',
        'host': os.environ.get("MONGODB_URI")
    }
    
    JWT_TOKEN_LOCATION=['cookies']
    JWT_COOKIE_CSRF_PROTECT = False
