from app.models import db, BudgetItem, environment, SCHEMA
from sqlalchemy.sql import text
from datetime import datetime

def seed_budget_items():

    budget_item1 = BudgetItem(
        user_id=1,
        budget_id=1,
        transaction=True,
        item_id=1,
    )
    budget_item2 = BudgetItem(
        user_id=2,
        budget_id=3,
        transaction=True,
        item_id=3
    )

    budget_item3 = BudgetItem(
        user_id=1,
        budget_id=1,
        transaction=False,
        item_id=1, 
    )
    budget_item4 = BudgetItem(
        user_id = 2,
        budget_id = 3,
        transaction = False,
        item_id = 3
    )
    budget_item5 = BudgetItem(
        user_id = 2,
        budget_id = 3,
        transaction = False,
        item_id = 4
    )
    budget_item6 = BudgetItem(
        user_id = 2,
        budget_id = 3,
        transaction = True,
        item_id = 4
    )
    budget_item7 = BudgetItem(
        user_id=1,
        budget_id=2,
        transaction=False,
        item_id=2
    )
    budget_item8 = BudgetItem(
        user_id=1,
        budget_id=1,
        transaction=False,
        item_id=5
    )
    budget_item9 = BudgetItem(
        user_id=1,
        budget_id=1,
        transaction=False,
        item_id=6
    )
    budget_item10 = BudgetItem(
        user_id=2,
        budget_id=4,
        transaction=False,
        item_id=7
    )
    budget_item11 = BudgetItem(
        user_id=1,
        budget_id=2,
        transaction=False,
        item_id=8
    )
    budget_item12 = BudgetItem(
        user_id=1,
        budget_id=2,
        transaction=False,
        item_id=9
    )
    budget_item13 = BudgetItem(
        user_id=1,
        budget_id=1,
        transaction=True,
        item_id=2
    )
    budget_item14 = BudgetItem(
        user_id=1,
        budget_id=1,
        transaction=True,
        item_id=5
    )
    budget_item15 = BudgetItem(
        user_id=1,
        budget_id=1,
        transaction=True,
        item_id=6
    )
    budget_item16 = BudgetItem(
        user_id=1,
        budget_id=1,
        transaction=True,
        item_id=7
    )
    budget_item17 = BudgetItem(
        user_id=1,
        budget_id=2,
        transaction=True,
        item_id=8
    )
    budget_item18 = BudgetItem(
        user_id=1,
        budget_id=2,
        transaction=True,
        item_id=9
    )
    budget_item19 = BudgetItem(
        user_id=1,
        budget_id=2,
        transaction=True,
        item_id=10
    )
    budget_item20 = BudgetItem(
        user_id=1,
        budget_id=2,
        transaction=True,
        item_id=11
    )
    budget_item21 = BudgetItem(
        user_id=1,
        budget_id=2,
        transaction=True,
        item_id=12
    )


    db.session.add(budget_item1)
    db.session.add(budget_item2)
    db.session.add(budget_item3)
    db.session.add(budget_item4)
    db.session.add(budget_item5)
    db.session.add(budget_item6)
    db.session.add(budget_item7)
    db.session.add(budget_item8)
    db.session.add(budget_item9)
    db.session.add(budget_item10)
    db.session.add(budget_item11)
    db.session.add(budget_item12)
    db.session.add(budget_item13)
    db.session.add(budget_item14)
    db.session.add(budget_item15)
    db.session.add(budget_item16)
    db.session.add(budget_item17)
    db.session.add(budget_item18)
    db.session.add(budget_item19)
    db.session.add(budget_item20)
    db.session.add(budget_item21)


    db.session.commit()

def undo_budget_items():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.budget_items RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM budgets"))
        
    db.session.commit()


    