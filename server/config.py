from dotenv import load_dotenv
import os
from datetime import timedelta

load_dotenv()

class Config(object):
    # Flask settings
    SECRET_KEY = os.environ.get("FLASK_SECRET", "SECRET")

    # Flask-MongoEngine settings
    MONGODB_SETTINGS = {
        'db': 'alkuluku',
        'host': os.environ.get("MONGODB_URI")
    }
    
    JWT_TOKEN_LOCATION = ['cookies']

    FROM_EMAIL = "email@alkuluku.io"
    SENDGRID_API_KEY = os.environ.get('SENDGRID_API_KEY')
