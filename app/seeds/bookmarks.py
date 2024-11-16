from app.models import db, Bookmark, environment, SCHEMA
from sqlalchemy.sql import text

def seed_bookmarks():
     bookmark_1 = Bookmark(user_id=1,article_id=6)
     bookmark_2 = Bookmark(user_id=1,article_id=11)
     bookmark_3 = Bookmark(user_id=1,article_id=14)
     bookmark_4 = Bookmark(user_id=1,article_id=20)
     bookmark_5 = Bookmark(user_id=2,article_id=13)
     bookmark_6 = Bookmark(user_id=2,article_id=15)
     bookmark_7 = Bookmark(user_id=3,article_id=25)
     bookmark_8 = Bookmark(user_id=1,article_id=26)

     db.session.add(bookmark_1)
     db.session.add(bookmark_2)
     db.session.add(bookmark_3)
     db.session.add(bookmark_4)
     db.session.add(bookmark_5)
     db.session.add(bookmark_6)
     db.session.add(bookmark_7)
     db.session.add(bookmark_8)


def undo_bookmarks():
        if environment == "production":
            db.session.execute(f"TRUNCATE table {SCHEMA}.bookmarks RESTART IDENTITY CASCADE;")
        else:
            db.session.execute(text("DELETE FROM bookmarks"))
        
        db.session.commit()