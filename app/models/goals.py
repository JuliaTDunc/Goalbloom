from .db import db, environment, SCHEMA, add_prefix_for_prod



class Goal(db.Model):
    __tablename__ = 'goals'

    if environment == "production":
        __table_args__= {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    name = db.Column(db.String, nullable=False)
    amount = db.Column(db.Float, nullable=False)
    saved_amount = db.Column(db.Float, nullable=False)
    end_date = db.Column(db.Date, nullable=False)

    user = db.relationship('User', back_populates='goals')


    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'name': self.name,
            'amount': self.amount,
            'saved_amount': self.saved_amount,
            'end_date': self.end_date.isoformat(),
        }