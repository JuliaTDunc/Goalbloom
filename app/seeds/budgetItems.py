from app.models import db, BudgetItem
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
        budget_id=2,
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


    db.session.add(budget_item1)
    db.session.add(budget_item2)
    db.session.add(budget_item3)
    db.session.add(budget_item4)


    db.session.commit()

def undo_budget_items():

    db.session.execute('TRUNCATE budget_items RESTART IDENTITY CASCADE;')
    db.session.commit()


    