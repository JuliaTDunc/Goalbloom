from .db import db, environment, SCHEMA, add_prefix_for_prod


class Transaction(db.Model):
    __tablename__ = 'transactions'

    if environment == "production":
        __table_args__= {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    name = db.Column(db.String, nullable=False)
    amount = db.Column(db.Float, nullable=False)
    date = db.Column(db.Date, nullable=False)
    frequency = db.Column(db.String, nullable=False)
    expense = db.Column(db.Boolean, default=False, nullable=False)
    expense_type_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('expense_types.id')), nullable=True)


    user = db.relationship('User', back_populates='transactions')
    expense_type = db.relationship('ExpenseType', back_populates='transactions')

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'date': self.date.isoFormat(),
            'description': self.description,
            'expense': self.expense,
            'expenseType': self.expense_type.to_dict() if self.expense_type else None,
        }