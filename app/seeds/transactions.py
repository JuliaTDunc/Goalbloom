from app.models import db, Transaction, ExpenseType, environment, SCHEMA
from sqlalchemy.sql import text
from datetime import date

def seed_transactions():
    trans_1 = Transaction(
        user_id=1,name="Dog Walking",amount=80,date=date(2024,9,7),frequency="two weeks",expense=False,expense_type_id=9)
    trans_2 = Transaction(
        user_id=1,name="Car Payment",amount=240,date=date(2024,10,6),frequency="once a month",expense=True,expense_type_id=2)
    trans_3 = Transaction(
        user_id=2,name="Paycheck",amount=520,date=date(2024,8,25),frequency="two weeks",expense=False,expense_type_id=9)
    trans_4 = Transaction(
        user_id=2,name="Textbooks",amount=950,date=date(2024,10,1),frequency="once",expense=True,expense_type_id=8)
    trans_5 = Transaction(
        user_id=1,name="Netflix",amount=14.99,date=date(2024,10,27),frequency="once a month",expense=True,expense_type_id=6)
    trans_6 = Transaction(
         user_id=1,name="Paycheck",amount=800,date=date(2024,10,10),frequency="two weeks",expense=False,expense_type_id=9)
    trans_7 = Transaction(
         user_id=1,name='Groceries',amount=60,date=date(2024,10,20),frequency="once",expense=True,expense_type_id=3)
    trans_8 = Transaction(
         user_id=1,name="Dog Walking",amount=80,date=date(2024,11,15),frequency="two weeks",expense=False,expense_type_id=9)
    trans_9 = Transaction(
         user_id=1,name="Netflix",amount=14.99,date=date(2024,11,27),frequency="once a month",expense=False,expense_type_id=6)
    trans_10 = Transaction(
         user_id=1,name="Meal Prep",amount="220",date=date(2024,11,13),frequency="once",expense=True,expense_type_id=3)
    trans_11 = Transaction(
         user_id=1,name='Parking',amount=80,date=date(2024,10,1),frequency="once a month",expense=True,expense_type_id=2)
    trans_12 = Transaction(
         user_id=1,name="Car Insurance",amount=140,date=date(2024,11,1),frequency="once a month",expense=True,expense_type_id=2)
    

    db.session.add(trans_1)
    db.session.add(trans_2)
    db.session.add(trans_3)
    db.session.add(trans_4)
    db.session.add(trans_5)
    db.session.add(trans_6)
    db.session.add(trans_7)
    db.session.add(trans_8)
    db.session.add(trans_9)
    db.session.add(trans_10)
    db.session.add(trans_11)
    db.session.add(trans_12)
    db.session.commit()


def undo_transactions():
        if environment == "production":
            db.session.execute(f"TRUNCATE table {SCHEMA}.transactions RESTART IDENTITY CASCADE;")
        else:
            db.session.execute(text("DELETE FROM transactions"))
        
        db.session.commit()