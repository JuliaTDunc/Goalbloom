from flask import Blueprint, request, jsonify
from flask_login import login_user
from google.oauth2 import id_token
from google.auth.transport import requests as grequests
from app.models import db, User
from app import csrf
import os
import random
import string

auth_oauth_routes = Blueprint('auth_oauth', __name__)

GOOGLE_CLIENT_ID = os.environ.get('GOOGLE_CLIENT_ID')

def generate_unique_username(first_name):
    base_username = first_name.lower()
    while True:
        random_suffix = ''.join(random.choices(string.digits, k=4))
        potential = f"{base_username}{random_suffix}"
        if not User.query.filter_by(username=potential).first():
            return potential

@auth_oauth_routes.route('/google', methods=['POST'])
@csrf.exempt
def google_oauth():
    data = request.get_json()
    token = data.get('token')

    if not token:
        return {'errors': {'message': 'Missing token'}}, 400

    try:
        idinfo = id_token.verify_oauth2_token(token, grequests.Request(), GOOGLE_CLIENT_ID)

        if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
            return {'errors': {'message': 'Wrong issuer'}}, 403

        google_id = idinfo['sub']
        email = idinfo['email']
        first_name = idinfo.get('given_name', 'user')

        user = User.query.filter_by(auth_provider='google', auth_provider_id=google_id).first()

        if not user:
            
            username = generate_unique_username(first_name)
            user = User(
                username=username,
                email=email,
                auth_provider='google',
                auth_provider_id=google_id
            )
            db.session.add(user)
            db.session.commit()

        login_user(user)
        return jsonify(user.to_dict()), 200

    except ValueError as e:
        return jsonify({'errors': {'message': f'Token verification failed: {str(e)}'}}), 401