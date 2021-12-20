from marshmallow import Schema, fields

class UserSchema(Schema):
    email = fields.Email(required=True)
    password = fields.Str(required=True)
    remember = fields.Bool(missing=False)


class DataSchema(Schema):
    data = fields.Dict(required=True)


class RequestPasswordResetSchema(Schema):
    email = fields.Email(required=True)


class ResetPasswordSchema(Schema):
    password = fields.Str(required=True)
    reset_token = fields.Str(required=True)
