from flask_wtf import FlaskForm
from wtforms import StringField, FloatField,DateField, TextAreaField
from wtforms.validators import DataRequired, Length, NumberRange


class BudgetForm(FlaskForm):
    name = StringField('Name', validators=[DataRequired(message="Budget name is required")])
    start_date = DateField('Start Date', validators=[DataRequired(message='Start date is required.')])
    end_date = DateField('End Date', validators=[DataRequired(message='End date is required.')])
