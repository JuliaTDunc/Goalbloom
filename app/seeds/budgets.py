from app.models import db, Budget, environment, SCHEMA
from sqlalchemy.sql import text
from datetime import datetime

def seed_budgets():
    budget_1 = Budget(
        user_id=1,
        name="October Budget",
        total_amount=1000.00,
        start_date=datetime(2024,10,1),
        end_date=datetime(2024,10,30),
    )

    budget_2 = Budget(
        user_id=1,
        name = "December Budget",
        total_amount = 240.00,
        start_date=datetime(2024,12,1),
        end_date=datetime(2024,12,30),
    )

    budget_3 = Budget(
        user_id = 2,
        name = "March Budget",
        total_amount = 1200.00,
        start_date=datetime(2025,3,1),
        end_date=datetime(2025,3,30),
    )

    budget_4 = Budget(
        user_id = 2,
        name = "June Budget",
        total_amount = 2200.00,
        start_date=datetime(2025,6,1),
        end_date=datetime(2025,6,30),
    )
    

    db.session.add(budget_1)
    db.session.add(budget_2)
    db.session.add(budget_3)
    db.session.add(budget_4)

def undo_budgets():
        if environment == "production":
            db.session.execute(f"TRUNCATE table {SCHEMA}.budgets RESTART IDENTITY CASCADE;")
        else:
            db.session.execute(text("DELETE FROM budgets"))
        
        db.session.commit()