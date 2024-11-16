from flask.cli import AppGroup
from .users import seed_users, undo_users
from .expense_types import seed_expense_types, undo_expense_types
from .transactions import seed_transactions, undo_transactions
from .goals import seed_goals, undo_goals
from .budgets import seed_budgets, undo_budgets
from .budgetItems import seed_budget_items, undo_budget_items
from .articles import seed_articles, undo_articles
from .bookmarks import seed_bookmarks, undo_bookmarks
from app.models.db import db, environment, SCHEMA

# Creates a seed group to hold our commands
# So we can type `flask seed --help`
seed_commands = AppGroup('seed')


# Creates the `flask seed all` command
@seed_commands.command('all')
def seed():
    if environment == 'production':
        # Before seeding in production, you want to run the seed undo 
        # command, which will  truncate all tables prefixed with 
        # the schema name (see comment in users.py undo_users function).
        # Make sure to add all your other model's undo functions below
        undo_bookmarks()
        undo_articles()
        undo_budget_items()
        undo_budgets()
        undo_goals()
        undo_transactions()
        undo_expense_types()
        undo_users()
    seed_users()
    seed_expense_types()
    seed_transactions()
    seed_goals()
    seed_budgets()
    seed_budget_items()
    seed_articles()
    seed_bookmarks()
    # Add other seed functions here


# Creates the `flask seed undo` command
@seed_commands.command('undo')
def undo():
    undo_users()
    undo_expense_types()
    undo_transactions()
    undo_goals()
    undo_budget_items()
    undo_budgets()
    undo_bookmarks()
    undo_articles()
    # Add other undo functions here
