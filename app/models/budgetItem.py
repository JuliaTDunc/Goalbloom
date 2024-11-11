from .db import db,environment,SCHEMA,add_prefix_for_prod
from datetime import datetime

class BudgetItem(db.Model):
    __tablename__ = 'budget_items'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    
    id = db.Column(db.Integer, primary_key=True)
    user_id =  db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    budget_id  =db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('budgets.id')), nullable=False)
    transaction = db.Column(db.Boolean, nullable=False)
    item_id = db.Column(db.Integer, nullable=False)

    user = db.relationship('User', back_populates='budget_items')
    budget = db.relationship('Budget', back_populates='budget_items')


    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'budget_id': self.budget_id,
            'transaction': self.transaction,
            'item_id': self.item_id,
        }