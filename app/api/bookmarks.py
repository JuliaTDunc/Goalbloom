from app.models import db, Article, Bookmark
from flask import Blueprint, jsonify, request
from flask_login import current_user, login_required

bookmark_routes = Blueprint("bookmark", __name__)

# GET all user Bookmarks
@bookmark_routes.route("", methods=['GET'])
@login_required
def get_all_bookmarks():
    bookmarks = Bookmark.query.filter_by(user_id=current_user.id).all()
    return jsonify([bookmark.to_dict() for bookmark in bookmarks]), 200

# POST a new Bookmark
@bookmark_routes.route("/<int:id>", methods=['POST'])
@login_required
def add_bookmark(id):
    existing_bookmark = Bookmark.query.filter_by(user_id=current_user.id, article_id=id).first()
    if existing_bookmark:
        return jsonify({'error': 'Bookmark already exists'}), 400

    new_bookmark = Bookmark(
        user_id=current_user.id,
        article_id=id
    )
    db.session.add(new_bookmark)
    db.session.commit()

    return jsonify(new_bookmark.to_dict()), 201
    
# DELETE a Bookmark by Article id
@bookmark_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_bookmark(id):
    bookmark = Bookmark.query.filter_by(user_id=current_user.id, id=id).first()

    if bookmark:
        db.session.delete(bookmark)
        db.session.commit()
        return jsonify({'message': 'Bookmark successfully deleted', 'bookmarkId': bookmark.id}), 200
    else:
        return jsonify({'error': 'Bookmark Not Found'}), 404
