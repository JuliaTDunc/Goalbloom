from app.models import db, ExpenseType, environment, SCHEMA
from sqlalchemy.sql import text

def seed_expense_types():
    housing = ExpenseType(name = "Housing")
    transportation = ExpenseType(name = "Transportation")
    food = ExpenseType(name = "Food")
    health_wellness = ExpenseType(name = "Health & Wellness")
    personal_care = ExpenseType(name = "Personal Care")
    entertainment = ExpenseType(name = "Entertainment")
    pets = ExpenseType(name = "Pets")
    debt_payments = ExpenseType(name = "Debt Payments")
    other_expenses = ExpenseType(name = "Other")

    db.session.add(housing)
    db.session.add(transportation)
    db.session.add(food)
    db.session.add(health_wellness)
    db.session.add(personal_care)
    db.session.add(entertainment)
    db.session.add(pets)
    db.session.add(debt_payments)
    db.session.add(other_expenses)
    db.session.commit()


def undo_expense_types():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.expense_types RESTART IDENTITY CASCADE;")
    else: db.session.execute(text("DELETE FROM expense_types"))
    db.session.commit()