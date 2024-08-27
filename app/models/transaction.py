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
    recurring_parent_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('transactions.id')), nullable=True)
    recurring_sequence_id = db.Column(db.Integer, nullable=True)
    expense = db.Column(db.Boolean, default=False, nullable=False)
    expense_type_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('expense_types.id')), nullable=True)


    user = db.relationship('User', back_populates='transactions')
    expense_type = db.relationship('ExpenseType', back_populates='transactions')
    parent_transaction = db.relationship('Transaction', remote_side=[id], backref='recurring_transactions')

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'name': self.name,
            'amount': self.amount,
            'date': self.date.isoFormat(),
            'frequency': self.frequency,
            'recurring_parent_id': self.recurring_parent_id,
            'recurring_sequence_id': self.recurring_sequence_id,
            'expense': self.expense,
            'expenseType': self.expense_type.to_dict() if self.expense_type else None,

        }