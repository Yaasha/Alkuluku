from flask import Blueprint, current_app, request, jsonify
from flask.helpers import url_for
from mongoengine.errors import DoesNotExist
from database import User
from forms import UserSchema, DataSchema, RequestPasswordResetSchema, ResetPasswordSchema
from marshmallow import ValidationError
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, set_access_cookies
from flask_jwt_extended import unset_jwt_cookies, jwt_required
from flask_jwt_extended import current_user
from itsdangerous import URLSafeSerializer
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from datetime import datetime, timedelta, timezone


routes = Blueprint('routes', __name__)


def set_jwt_access_token(response, user, remember=False):
    if remember:
        expires_delta = current_app.config.get("JWT_ACCESS_TOKEN_EXPIRES_REMEMBER")
    else:
        expires_delta = current_app.config.get("JWT_ACCESS_TOKEN_EXPIRES")
    access_token = create_access_token(identity=user, 
                                       expires_delta=expires_delta, 
                                       additional_claims={"remember": remember})
    set_access_cookies(response, access_token)


@routes.route('/')
def index():
    return current_app.send_static_file('index.html')


@routes.route('/settings', methods=['GET', 'POST'])
@jwt_required()
def settings():
    if request.method == 'POST':
        schema = DataSchema()
        try:
            data = schema.load(request.get_json())
            current_user.settings = data['data']
            current_user.save()

            return jsonify({
                "status": "success",
                "data": current_user.settings,
            })
        except ValidationError as err:
            return {"errors": err.messages}, 422
    else:
        return jsonify({
            "status": "success",
            "data": current_user.settings,
        })


@routes.route('/country-data', methods=['GET', 'POST'])
@jwt_required()
def country_data():
    if request.method == 'POST':
        schema = DataSchema()
        try:
            data = schema.load(request.get_json())
            current_user.country_data = data['data']
            current_user.save()

            return jsonify({
                "status": "success",
                "data": current_user.country_data,
            })
        except ValidationError as err:
            return {"errors": err.messages}, 422
    else:
        return jsonify({
            "status": "success",
            "data": current_user.country_data,
        })


@routes.route('/user-data', methods=['GET'])
@jwt_required()
def user_data():
    return jsonify({
        "status": "success",
        "data": {
            "email": current_user.email,
        },
    })


@routes.route('/register', methods=['POST'])
def register():
    schema = UserSchema()
    try:
        data = schema.load(request.get_json())

        try:
            User.objects.get(email=data['email'])
            return jsonify(message="Unable to create user."), 400
        except DoesNotExist:
            user = User(
                email=data['email'],
                password=generate_password_hash(data['password']),
                country_data={},
            )

            user.save()

            response = jsonify(message="User successfully registered")
            set_jwt_access_token(response, user, data["remember"])

            return response, 201
    except ValidationError as err:
        return {"errors": err.messages}, 422


@routes.route('/login', methods=['POST'])
def login():
    schema = UserSchema()

    try:
        data = schema.load(request.get_json())
        
        try:
            user = User.objects.get(email=data['email'])
            
            if check_password_hash(user.password, data['password']):
                response = jsonify(message="User successfully logged in")
                set_jwt_access_token(response, user, data["remember"])
                return response, 200
            else:
                return jsonify(message="Unauthorized"), 401
        except DoesNotExist:
            return jsonify(message="Unauthorized"), 401
    except ValidationError as err:
        return {"errors": err.messages}, 422


@routes.route('/logout', methods=['POST'])
def logout():
    response = jsonify(message="User successfully logged out")
    unset_jwt_cookies(response)
    return response, 200


@routes.route('/request-password-reset', methods=['POST'])
def request_password_reset():
    schema = RequestPasswordResetSchema()

    try:
        data = schema.load(request.get_json())
        try:
            user = User.objects.get(email=data['email'])

            serializer = URLSafeSerializer(current_app.config.get("SECRET_KEY"))
            created_at = datetime.now()
            expires_at = created_at + timedelta(hours=1)
            reset_token = serializer.dumps((user.email, created_at.isoformat(), expires_at.isoformat()))

            message = Mail(
                from_email=current_app.config.get("FROM_EMAIL"),
                to_emails=user.email)
            message.dynamic_template_data = {
                "password_link": url_for("routes.index", password_reset=reset_token, _external=True)
            }
            message.template_id = "d-bc219bf7ddb04feda7dffce318f1e22e"
            
            sg = SendGridAPIClient(current_app.config.get("SENDGRID_API_KEY"))
            response = sg.send(message)
            code, body, headers = response.status_code, response.body, response.headers
            return jsonify(message="Password reset link sent")
        except Exception:
            return jsonify(message="Password reset link sent")
    except ValidationError as err:
        return {"errors": err.messages}, 422


@routes.route('/reset-password', methods=['POST'])
def reset_password():
    schema = ResetPasswordSchema()

    try:
        data = schema.load(request.get_json())
        try:
            serializer = URLSafeSerializer(current_app.config.get("SECRET_KEY"))
            email, created_at, expires_at = serializer.loads(data["reset_token"])
            created_at = datetime.fromisoformat(created_at)
            expires_at = datetime.fromisoformat(expires_at)
            
            now = datetime.now()
            user = User.objects.get(email=email)
            if (not user.last_password_change or user.last_password_change < created_at) and expires_at > now:
                user.password = generate_password_hash(data['password'])
                user.last_password_change = now
                user.save()
                return jsonify(message="Password reset successfully")
            
            return jsonify(message="An error occured"), 400
        except Exception:
            return jsonify(message="An error occured"), 400
    except ValidationError as err:
        return {"errors": err.messages}, 422


@routes.route('/favicon.ico')
def favicon():
    return current_app.send_static_file('favicon.ico')
