from app.models import db, Goal
from sqlalchemy.orm import joinedload
from flask import Blueprint, request, jsonify
from flask_login import current_user, login_required
from app.forms.goal_form import GoalForm
from datetime import datetime


goal_routes = Blueprint("goal", __name__)

# GET all user Goals

@goal_routes.route("", methods=['GET'])
@login_required
def get_all_goals():
    try:
        goals = Goal.query.filter_by(user_id=current_user.id).all()
        return jsonify([goal.to_dict() for goal in goals]), 200
    except Exception as e:
        return jsonify({"error": str(e)}),500
    

# GET a Goal by goal_id

@goal_routes.route('/<int:goal_id>', methods=['GET'])
@login_required
def get_goal_by_id(goal_id):
    print(f"Fetching goal with ID: {goal_id} for user ID: {current_user.id}")
    goal = Goal.query.filter_by(id=goal_id, user_id=current_user.id).first()
    if not goal:
        return jsonify({"error": "Goal not found"}), 404
    print(f"Goal fetched: {goal.to_dict()}")
    return jsonify(goal.to_dict()), 200

# POST a new Goal

@goal_routes.route("", methods=['POST'])
@login_required
def create_goal():
        data = request.get_json()
        form=GoalForm()
        form['csrf_token'].data=request.cookies['csrf_token']
        if form.validate_on_submit():
            new_goal = Goal(
                user_id = current_user.id,
                name=form.data['name'],
                amount=form.data['amount'],
                saved_amount=form.data['saved_amount'],
                end_date=form.data['end_date']
            )

            db.session.add(new_goal)
            db.session.commit()
            return jsonify(new_goal.to_dict()), 201
        else:
            return jsonify(form.errors), 400

# PUT a goal

@goal_routes.route('/<int:goal_id>', methods=['PUT'])
@login_required
def update_goal(goal_id):
    goal = Goal.query.filter_by(id=goal_id,user_id=current_user.id).first()
    
    form=GoalForm()
    form['csrf_token'].data=request.cookies['csrf_token']
    if form.validate_on_submit():
        goal.name = form.data['name']
        goal.amount = form.data['amount']
        goal.saved_amount=form.data['saved_amount']
        goal.end_date=form.data['end_date']

        db.session.commit()
        return jsonify(goal.to_dict()),200
    return jsonify(form.errors),400

   

# DELETE a goal

@goal_routes.route('/<int:goal_id>', methods=['DELETE'])
@login_required
def delete_goal(goal_id):
    goal = Goal.query.get(goal_id)

    if goal and goal.user_id == current_user.id:
        db.session.delete(goal)
        db.session.commit()
        return jsonify({'message': 'Goal successfully deleted', 'goalId': goal_id}), 200
    else:
        return jsonify({'error': 'Goal not found or unauthorized'}), 404