# from flask_sqlalchemy import SQLAlchemy
# from werkzeug.security import generate_password_hash, check_password_hash
# from datetime import datetime


# db = SQLAlchemy()

# class User(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     email = db.Column(db.String(120), unique=True, nullable=False)
#     password_hash = db.Column(db.String(128), nullable=False)

#     appointments = db.relationship('Appointment', backref='owner', lazy=True)


#     def set_password(self, password):
#         self.password_hash = generate_password_hash(password)

#     def check_password(self, password):
#         return check_password_hash(self.password_hash, password)



# class Appointment(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     client_name = db.Column(db.String(100), nullable=False)
#     service = db.Column(db.String(100), nullable=False)
#     date = db.Column(db.String(20), nullable=False)
#     time = db.Column(db.String(20), nullable=False)
#     fee = db.Column(db.Float, nullable=False)
#     created_at = db.Column(db.DateTime, default=datetime.utcnow)

#     user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
#     user = db.relationship('User', backref=db.backref('appointments', lazy=True))


from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
from sqlalchemy import Text


db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)

    # Define the relationship here; 'appointments' will be accessible from the user
    appointments = db.relationship('Appointment', backref='user', lazy=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)


class Appointment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    client_name = db.Column(db.String(100), nullable=False)
    client_contact = db.Column(db.String(100), nullable=False)
    service = db.Column(db.String(100), nullable=False)
    date = db.Column(db.String(20), nullable=False)
    time = db.Column(db.String(20), nullable=False)
    fee = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(20), nullable=False, default='Scheduled')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    notes = db.Column(Text)  # New field for rich-text notes
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
