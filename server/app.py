from config import Config
from routes import routes, set_jwt_access_token
from flask import Flask
from database import db, User
from flask_jwt_extended import JWTManager, get_jwt_identity, get_jwt
from flask_cors import CORS
from datetime import datetime, timedelta, timezone
from mongoengine.errors import DoesNotExist
from flask_talisman import Talisman
from flask_compress import Compress

def create_app():
    # Setup Flask and load app.config
    app = Flask(__name__, static_folder="../client/dist/", static_url_path="/")
    csp = {
        'default-src': ['\'self\''],
        'style-src': ['unpkg.com', 'cdn.jsdelivr.net', '\'self\'', '\'unsafe-inline\''],
        'font-src': ['unpkg.com', 'cdn.jsdelivr.net', '\'self\''],
        'img-src': ['\'self\'', 'data:'],
        'script-src-elem': ['\'self\'', 'storage.googleapis.com'],
    }
    Talisman(app, content_security_policy=csp, force_https=False)
    Compress(app)
    app.config.from_object(Config)
    app.register_blueprint(routes)
    db.init_app(app)
    jwt = JWTManager(app)
    CORS(app, supports_credentials=True)
    
    @jwt.user_identity_loader
    def user_identity_lookup(user):
        if type(user) == str:
            return user
        else:
            return user.email

    @jwt.user_lookup_loader
    def user_lookup_callback(_jwt_header, jwt_data):
        email = jwt_data["sub"]
        try:
            return User.objects.get(email=email)
        except DoesNotExist:
            return None

    @app.after_request
    def refresh_expiring_jwts(response):
        try:
            exp_timestamp = get_jwt()["exp"]
            remember = get_jwt().get("remember")
            now = datetime.now(timezone.utc)
            if remember:
                target_timestamp = datetime.timestamp(now + timedelta(days=15))
            else:
                target_timestamp = datetime.timestamp(now + timedelta(minutes=30))

            if target_timestamp > exp_timestamp:
                set_jwt_access_token(response, get_jwt_identity(), remember)
            return response
        except (RuntimeError, KeyError):
            # Case where there is not a valid JWT. Just return the original respone
            return response

    return app

app = create_app()

# Start development web server
if __name__=='__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)