from app.models import db, Transaction, ExpenseType
from sqlalchemy.orm import joinedload
from flask import Blueprint, request, jsonify
from flask_login import current_user, login_required
from app.forms.transaction_form import TransactionForm

transaction_routes = Blueprint("transaction", __name__)

# GET all user Transactions

@transaction_routes.route("", methods=['GET'])
@login_required
def get_all_transactions():
    try:
        transactions = Transaction.query.options(joinedload(Transaction.expense_type)).filter_by(user_id=current_user.id).all()
        return jsonify([transaction.to_dict() for transaction in transactions]), 200
    except Exception as e:
        return jsonify({"error": str(e)}),500

# GET a Transaction by id

@transaction_routes.route('/<int:id>', methods=['GET'])
@login_required
def get_transaction_by_id(id):
    transaction = Transaction.query.filter_by(id=id, user_id=current_user.id).first()
    if not transaction:
        return jsonify({"error": "Goal not found"}), 404
    print(f"Transaction fetched: {transaction.to_dict()}")
    return jsonify(transaction.to_dict()), 200

# POST a new Transaction

@transaction_routes.route("", methods=["POST"])
@login_required
def create_transaction():
    data = request.get_json()
    form = TransactionForm()
    form.expense_type.choices = [(expense_type.id, expense_type.name) for expense_type in ExpenseType.query.all()]
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        new_transaction = Transaction(
            user_id = current_user.id,
            name = form.data["name"],
            amount = form.data["amount"],
            date = form.data["date"],
            frequency = form.data["frequency"],
            expense = form.data["expense"],
            expense_type_id = form.data["expense_type"]
            )
        db.session.add(new_transaction)
        db.session.commit()    
        return jsonify(new_transaction.to_dict()),201
    else:
     return jsonify(form.errors),400

# PUT update a Transaction
@transaction_routes.route("/<int:id>", methods=["PUT"])
@login_required
def edit_transaction(id):
        transaction = Transaction.query.filter_by(id=id, user_id=current_user.id).first_or_404()

        form = TransactionForm()
        form.expense_type.choices = [(expense_type.id, expense_type.name) for expense_type in ExpenseType.query.all()]
        form['csrf_token'].data = request.cookies['csrf_token']
        if form.validate_on_submit():
                transaction.name = form.data["name"]
                transaction.amount = form.data["amount"]
                transaction.date = form.data["date"]
                transaction.frequency = form.data["frequency"]
                transaction.expense = form.data["expense"]
                selected_expense_type_id = form.data["expense_type"]
                transaction.expense_type = ExpenseType.query.get(selected_expense_type_id)


                db.session.commit()
                return jsonify(transaction.to_dict()), 200
        return jsonify(form.errors),400


# DELETE a Transaction 

@transaction_routes.route("/<int:id>", methods=["DELETE"])
@login_required
def delete_transaction(id):
    transaction = Transaction.query.get_or_404(id)

    db.session.delete(transaction)
    db.session.commit()

    return {'message': 'Transaction Deleted!'}

# GET all Expense Types
@transaction_routes.route('/expenseTypes', methods=['GET'])
#@login_required
def get_expense_types():
    try:
        expense_types = ExpenseType.query.all()
        return jsonify([et.to_dict() for et in expense_types]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
     