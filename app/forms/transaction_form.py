from flask_wtf import FlaskForm
from wtforms import StringField, FloatField, SelectField, DateField, BooleanField
from wtforms.validators import DataRequired, Length, NumberRange

class TransactionForm(FlaskForm):
    name = StringField("Name", validators=[DataRequired(), Length(max=50)])
    amount = FloatField("Amount", validators=[DataRequired()])
    date = DateField("Date", validators=[DataRequired()], format='%Y-%m-%d')
    frequency = StringField("Frequency", validators=[DataRequired()], default='once')
    expense = BooleanField("Expense", default=False)
    expense_type = SelectField("Expense Type", validators=[DataRequired()])