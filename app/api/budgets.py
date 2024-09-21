from app.models import db, Budget, BudgetItem
from flask import Blueprint, request, jsonify
from flask_login import current_user, login_required
#from app.forms.budget_form import BudgetForm

budget_routes = Blueprint("budget", __name__)

# GET all user Budgets


@budget_routes.route("", methods=['GET'])
@login_required
def get_all_budgets():
    budgets = Budget.query.filter_by(user_id=current_user.id).all()
    return jsonify([budget.to_dict() for budget in budgets]), 200

# GET a budget by ID

@budget_routes.route("/<int:id>", methods=['GET'])
@login_required
def get_budget_by_id(id):
    budget = Budget.query.filter_by(id=id,user_id=current_user.id).first()

    if not budget:
        return jsonify({'error': 'Budget not found'}), 404
    
    return jsonify(budget.to_dict()), 200