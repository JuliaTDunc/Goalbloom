from .db import db, environment, SCHEMA



class Article(db.Model):
    __tablename__ = 'articles'

    if environment == "production":
        __table_args__= {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False)
    url = db.Column(db.String, nullable=False)
    level = db.Column(db.Integer, nullable=False)

    bookmarks = db.relationship('Bookmark', back_populates='article', cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.name,
            'url': self.url,
            'level': self.level,
        }