from app.models import db, Goal, environment, SCHEMA
from sqlalchemy.sql import text
from datetime import date

def seed_goals():
    goal_1 = Goal(
        user_id=1,name="Concert Ticket",amount=280,saved_amount=20,end_date=date(2024,10,7))
    goal_2 = Goal(
        user_id=1,name="Monthly Goal",amount=100, saved_amount=85,end_date=date(2024,9, 30))
    goal_3 = Goal(
        user_id=2,name="Road Trip",amount=300,saved_amount=205,end_date=date(2024,10,26))
    goal_4 = Goal(
        user_id=2,name="Monthly Goal",amount=200, saved_amount=10,end_date=date(2024,12,14))
    goal_5 = Goal(
        user_id=1,name="Kids Party",amount=300,saved_amount=80,end_date=date(2024,10,27))
    goal_6 = Goal(
        user_id=1,name="Shopping Budget",amount=600,saved_amount=250,end_date=date(2024,10,17))
    goal_7 = Goal(
         user_id=2,name="Christmas Shopping",amount=600,saved_amount=250,end_date=date(2024,12,24))
    goal_8 = Goal(
        user_id=1,name="New Headlights",amount=1000,saved_amount=150,end_date=date(2024,11,1))
    
    

    db.session.add(goal_1)
    db.session.add(goal_2)
    db.session.add(goal_3)
    db.session.add(goal_4)
    db.session.add(goal_5)
    db.session.add(goal_6)
    db.session.add(goal_7)
    db.session.add(goal_8)
    db.session.commit()


def undo_goals():
        if environment == "production":
            db.session.execute(f"TRUNCATE table {SCHEMA}.transactions RESTART IDENTITY CASCADE;")
        else:
            db.session.execute(text("DELETE FROM goals"))
        
        db.session.commit()