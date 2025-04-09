from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired, Email, ValidationError, Optional
from app.models import User


def user_exists(form, field):
    # Checking if user exists
    email = field.data
    user = User.query.filter(User.email == email).first()
    if user:
        raise ValidationError('Email address is already in use.')


def username_exists(form, field):
    # Checking if username is already in use
    username = field.data
    user = User.query.filter(User.username == username).first()
    if user:
        raise ValidationError('Username is already in use.')


class SignUpForm(FlaskForm):
    username = StringField(
        'username', validators=[DataRequired(), username_exists])
    email = StringField('email', validators=[DataRequired(), user_exists])
    password = StringField('password', validators=[Optional()])
    auth_provider = StringField('auth_provider')
    auth_provider_id = StringField('auth_provider_id')

    def validate(self, extra_validators=None):
        if not super().validate(extra_validators):
            return False

        if not self.password.data and (not self.auth_provider.data or not self.auth_provider_id.data):
            msg = 'Either a password or a provider/id must be provided.'
            self.password.errors.append(msg)
            return False

        return True
