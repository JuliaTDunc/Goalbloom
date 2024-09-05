from app.models import db, Goal
from sqlalchemy.orm import joinedload
from flask import Blueprint, request, jsonify
from flask_login import current_user, login_required
# from app.forms.goal_form import GoalForm
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

@goal_routes.route('/api/goals/<int:goal_id>', methods=['GET'])
@login_required
def get_goal_by_id(goal_id):
    goal = Goal.query.filter_by(id=goal_id, user_id=current_user.id).first()
    if not goal:
        return jsonify({"error": "Goal not found"}), 404
    return jsonify(goal.to_dict()), 200

# POST a new Goal

@goal_routes.route('/api/goals', methods=['POST'])
@login_required
def create_goal():
    try: 
        data = request.get_json()
        name = data['name']
        amount = data['amount']
        saved_amount = data['saved_amount']
        end_date=data['end_date']

        if not name or not amount or not end_date:
            # change to individual inputs
            return jsonify({"error": "All fields are required"}), 400
        end_date = datetime.strptime(end_date, '%Y-%m-%d')

        new_goal = Goal(
            user_id = current_user.id,
            name=name,
            amount=amount,
            saved_amount=saved_amount,
            end_date=end_date,
            created_at=datetime.now(),
            updated_at=datetime.now()
        )

        db.session.add(new_goal)
        db.session.commit()

        return jsonify(new_goal.to_dict()), 201
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# PUT a goal

@goal_routes.route('/api/goals/<int:goal_id>', methods=['PUT'])
@login_required
def update_goal(goal_id):
    goal = Goal.query.filter_by(id=goal_id,user_id=current_user.id)
    if not goal:
        return jsonify({"error": "Goal not found"}), 404

    data = request.get_json()
    name =data.get('name', goal.name)
    amount = data.get('amount', goal.amount)
    saved_amount = data.get('saved_amount', goal.saved_amount)
    end_date = data.get('end_date', goal.end_date)

    if end_date and isinstance(end_date, str):
        end_date = datetime.strptime(end_date, '%Y-%m-%d')

    # edit to individual errors
    if not name or amount or end_date:
        return jsonify({"error": "fields required"}), 400
    
    goal.name = name
    goal.amount = amount
    goal.saved_amount = saved_amount
    goal.end_date = end_date
    goal.updated_at = datetime.now()

    db.session.commit()
    return jsonify(goal.to_dict()), 200

# DELETE a goal

@goal_routes.route('/api/goals/<int:goal_id>', methods=['DELETE'])
@login_required
def delete_goal(goal_id):
    goal = Goal.query.filter_by(id=goal_id,user_id=current_user.id).first()

    if not goal:
        return jsonify({"error": "Goal not found"})
    
    db.session.delete(goal)
    db.session.commit()

    return jsonify({"message": "Goal deleted!"}), 200

