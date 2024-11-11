from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime

class Budget(db.Model):
    __tablename__ = 'budgets'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer,primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    name = db.Column(db.String, nullable=False)
    total_amount = db.Column(db.Float, nullable=False)
    start_date = db.Column(db.DateTime, nullable=False)
    end_date = db.Column(db.DateTime, nullable=False)

    user = db.relationship('User', back_populates='budgets')
    budget_items = db.relationship('BudgetItem', back_populates='budget', cascade='all')


    def to_dict(self):
        return{
            'id': self.id,
            'user_id': self.user_id,
            'name': self.name,
            'total_amount': self.total_amount,
            'start_date': self.start_date.isoformat(),
            'end_date': self.end_date.isoformat(),
        }
