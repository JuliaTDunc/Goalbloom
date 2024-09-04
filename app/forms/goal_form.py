from flask_wtf import FlaskForm
from wtforms import StringField, FloatField,DateField
from wtforms.validators import DataRequired, Length, NumberRange

class GoalForm(FlaskForm):
    name = StringField("Name", validators=[DataRequired()])
    amount = FloatField("Amount", validators=[DataRequired(), NumberRange(min=0)])
    end_date = DateField("Date", validators=[DataRequired()], format='%m/%d/%Y')