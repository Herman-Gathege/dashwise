from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
from flask_migrate import Migrate

from models import db
from config import Config
from auth import auth_bp
from appointments import appointments_bp

load_dotenv()


app = Flask(__name__, instance_relative_config=True)
app.config.from_object(Config)

db.init_app(app)
jwt = JWTManager(app)
migrate = Migrate(app, db)
CORS(app, supports_credentials=True, resources={r"/*": {"origins": "*"}})


app.register_blueprint(auth_bp)
app.register_blueprint(appointments_bp)


if __name__ == '__main__':
    app.run(debug=True)
