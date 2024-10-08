from app.models import db, Transaction, ExpenseType, environment, SCHEMA
from sqlalchemy.sql import text
from datetime import date

def seed_transactions():
    trans_1 = Transaction(
        user_id=1,name="Dog Walking",amount=80,date=date(2024,9,7),frequency="two weeks",expense=False,expense_type_id=9)
    trans_2 = Transaction(
        user_id=1,name="Car Payment",amount=240,date=date(2024,9,6),frequency="once a month",expense=True,expense_type_id=2)
    trans_3 = Transaction(
        user_id=2,name="Paycheck",amount=520,date=date(2024,8,25),frequency="two weeks",expense=False,expense_type_id=9)
    trans_4 = Transaction(
        user_id=2,name="Textbooks",amount=950,date=date(2024,10,1),frequency="once",expense=True,expense_type_id=8)
    trans_5 = Transaction(
        user_id=1,name="Netflix",amount=14.99,date=date(2024,8,27),frequency="once a month",expense=True,expense_type_id=6)
    

    db.session.add(trans_1)
    db.session.add(trans_2)
    db.session.add(trans_3)
    db.session.add(trans_4)
    db.session.add(trans_5)
    db.session.commit()


def undo_transactions():
        if environment == "production":
            db.session.execute(f"TRUNCATE table {SCHEMA}.transactions RESTART IDENTITY CASCADE;")
        else:
            db.session.execute(text("DELETE FROM transactions"))
        
        db.session.commit()