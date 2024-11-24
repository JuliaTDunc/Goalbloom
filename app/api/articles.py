from app.models import db, Article
from flask import Blueprint, jsonify
from flask_login import login_required

article_routes = Blueprint("article", __name__)


# GET all Articles
@article_routes.route("", methods=['GET'])
@login_required
def get_all_articles():
    articles = Article.query.all()
    return jsonify([article.to_dict() for article in articles]), 200

# GET an Article by ID
@article_routes.route("/<int:id>", methods=['GET'])
@login_required
def get_article_by_id(id):
    article = Article.query.get_or_404(id)

    if not article:
        return jsonify({'error': 'Article not found'}), 404
    
    return jsonify(article.to_dict()), 200