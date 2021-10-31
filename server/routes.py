from flask import Blueprint, current_app, request, jsonify
from mongoengine.errors import DoesNotExist
from database import User
from forms import UserSchema, DataSchema
from marshmallow import ValidationError
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, set_access_cookies
from flask_jwt_extended import unset_jwt_cookies, jwt_required
from flask_jwt_extended import current_user


routes = Blueprint('routes', __name__)


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
                password=generate_password_hash(data['password'])
            )

            user.save()
            access_token = create_access_token(identity=user)

            response = jsonify(message="User successfully registered")
            set_access_cookies(response, access_token)

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
                access_token = create_access_token(identity=user)

                response = jsonify(message="User successfully logged in")
                set_access_cookies(response, access_token)
                return response, 200
            else:
                return jsonify(message="Unauthorized"), 401
        except DoesNotExist:
            return jsonify(message="Unauthorized"), 401
    except ValidationError as err:
        return {"errors": err.messages}, 422


@routes.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    response = jsonify(message="User successfully logged out")
    unset_jwt_cookies(response)
    return response, 200
