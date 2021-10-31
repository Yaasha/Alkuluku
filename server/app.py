from config import Config
from routes import routes
from flask import Flask
from database import db, User
from flask_jwt_extended import JWTManager
from flask_cors import CORS

def create_app():
    # Setup Flask and load app.config
    app = Flask(__name__, static_folder="../client/dist/", static_url_path="/")
    app.config.from_object(Config)
    app.register_blueprint(routes)
    db.init_app(app)
    jwt = JWTManager(app)
    CORS(app, supports_credentials=True)
    
    @jwt.user_identity_loader
    def user_identity_lookup(user):
        return user.email

    @jwt.user_lookup_loader
    def user_lookup_callback(_jwt_header, jwt_data):
        email = jwt_data["sub"]
        try:
            return User.objects.get(email=email)
        except DoesNotExist:
            return None

    return app


# Start development web server
if __name__=='__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=5000, debug=True)