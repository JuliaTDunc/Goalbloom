from .db import db, environment, SCHEMA, add_prefix_for_prod


class ExpenseType(db.Model):
    __tablename__ = 'expense_types'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}


    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False, unique=True)
    
    transactions = db.relationship('Transaction', back_populates='expense_type')

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
        }
