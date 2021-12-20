from flask import Flask
from flask_mongoengine import MongoEngine

# Setup Flask-MongoEngine
db = MongoEngine()

class User(db.Document):
    active = db.BooleanField(default=True)

    # User authentication information
    email = db.StringField()
    password = db.StringField()
    last_password_change = db.DateTimeField()

    # User data
    settings = db.DictField()
    country_data = db.DictField()
