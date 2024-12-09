from app.models import db, Budget, BudgetItem, Transaction, Goal
from flask import Blueprint, request, jsonify
from flask_login import current_user, login_required
from app.forms.budget_form import BudgetForm
import logging
import openai
import os

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

# GET budget items from a budget ID

@budget_routes.route("/<int:id>/items",methods=['GET'])
@login_required
def get_budget_items_by_id(id):
    budget_items = BudgetItem.query.filter_by(budget_id=id, user_id=current_user.id).all()
    return {'budgetItems': [item.to_dict() for item in budget_items]}


# POST a new budget

@budget_routes.route('', methods=['POST'])
@login_required
def create_budget():
    form = BudgetForm()
    logging.info('form request data recieved ' ,request.form)
    logging.info("JSON data recieved ", request.json)

    income_ids = request.json.get('income_ids', [])
    expense_ids = request.json.get('expense_ids', [])
    goal_ids = request.json.get('goal_ids', [])

    incomes = Transaction.query.filter(Transaction.id.in_(income_ids)).all()
    expenses = Transaction.query.filter(Transaction.id.in_(expense_ids)).all()
    goals = Goal.query.filter(Goal.id.in_(goal_ids)).all()

    totalAmount = sum(income.amount for income in incomes)

    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        new_budget = Budget(
            user_id = current_user.id,
            name = form.name.data,
            start_date = form.start_date.data,
            end_date = form.end_date.data,
            total_amount = totalAmount
        )

        db.session.add(new_budget)
        db.session.flush()

        budget_items = []

        for income in incomes:
            budget_items.append(BudgetItem(user_id=current_user.id, budget_id=new_budget.id, item_id=income.id, transaction=True))
        for expense in expenses:
            budget_items.append(BudgetItem(user_id=current_user.id, budget_id=new_budget.id, item_id=expense.id, transaction=True))
        for goal in goals:
            budget_items.append(BudgetItem(user_id=current_user.id, budget_id=new_budget.id, item_id=goal.id, transaction=False))
        
        db. session.add_all(budget_items)
        db.session.commit()

        return jsonify(new_budget.to_dict()), 200
    return jsonify({'errors': form.errors}), 400
# EDIT a budget
@budget_routes.route('/<int:budget_id>', methods=['PUT'])
@login_required
def edit_budget(budget_id):
    form = BudgetForm()
    budget = Budget.query.get(budget_id)

    if not budget:
        return jsonify({'error': 'Budget not found'}), 404
    if budget.user_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    income_ids = request.json.get('income_ids', [])
    expense_ids = request.json.get('expense_ids', [])
    goal_ids = request.json.get('goal_ids', [])
    total_amount = request.json.get('total_amount', budget.total_amount)

    incomes = Transaction.query.filter(Transaction.id.in_(income_ids)).all()
    expenses = Transaction.query.filter(Transaction.id.in_(expense_ids)).all()
    goals = Goal.query.filter(Goal.id.in_(goal_ids)).all()
    
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        budget.name = form.name.data
        budget.start_date = form.start_date.data
        budget.end_date = form.end_date.data
        budget.total_amount=total_amount

        BudgetItem.query.filter_by(budget_id=budget_id).delete()
        budget_items = []

        for income in incomes:
            budget_items.append(BudgetItem(user_id=current_user.id, budget_id=budget.id, item_id=income.id, transaction=True))
        for expense in expenses:
            budget_items.append(BudgetItem(user_id=current_user.id, budget_id=budget.id, item_id=expense.id, transaction=True))
        for goal in goals:
            budget_items.append(BudgetItem(user_id=current_user.id, budget_id=budget.id, item_id=goal.id, transaction=False))
        
        db.session.add_all(budget_items)
        db.session.commit()

        return jsonify(budget.to_dict()), 200
    return jsonify({'errors': form.errors}), 400

# NEW BUDGET SUMMARY 
@budget_routes.route('/<int:id>/summary', methods=['POST'])
def generate_summary(id):
    data = request.json
    budget_details = data.get('budget_details')
    openai.api_key = os.environ.get('OPENAI_API_KEY')
    print(f"Received data: {data}")
    if not budget_details:
        return jsonify({'error': 'Budget details are required'}), 400
    client = openai.Client()
    prompt=f"Create a summary for this budget: {budget_details}"

    res = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": prompt}
        ],
        max_tokens=150,
    )
    summary = res['choices'][0]['message']['content']
    return jsonify({'summary': summary})
        #return res;
    

#DELETE a budget route
@budget_routes.route('/<int:budget_id>', methods=['DELETE'])
@login_required
def delete_budget(budget_id):
    budget = Budget.query.get(budget_id)

    if not budget:
        return jsonify({'error': 'Budget not found'}), 404
    if budget.user_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    BudgetItem.query.filter_by(budget_id=budget_id).delete()

    db.session.delete(budget)
    db.session.commit()

    return jsonify({'message': 'Budget deleted successfully'})
