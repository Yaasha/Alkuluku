from marshmallow import Schema, fields

class UserSchema(Schema):
    email = fields.Email(required=True)
    password = fields.Str(required=True)


class DataSchema(Schema):
    data = fields.Dict(required=True)
