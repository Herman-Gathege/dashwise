# from flask import Blueprint, request, jsonify
# from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
# from models import db, User

# auth_bp = Blueprint('auth', __name__)

# @auth_bp.route('/signup', methods=['POST'])
# def signup():
#     data = request.json
#     if User.query.filter_by(email=data['email']).first():
#         return jsonify({'error': 'User already exists'}), 400
#     user = User(email=data['email'])
#     user.set_password(data['password'])
#     db.session.add(user)
#     db.session.commit()
#     return jsonify({'message': 'User created'}), 201

# @auth_bp.route('/login', methods=['POST'])
# def login():
#     data = request.json
#     user = User.query.filter_by(email=data['email']).first()
#     if user and user.check_password(data['password']):
#         access_token = create_access_token(identity=str(user.id))  # <-- fix here
#         return jsonify({'token': access_token}), 200
#     return jsonify({'error': 'Invalid credentials'}), 401

# @auth_bp.route('/me', methods=['GET'])
# @jwt_required()
# def me():
#     user_id = int(get_jwt_identity())  # <-- fix here
#     user = User.query.get(user_id)
#     return jsonify({'email': user.email}), 200


from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from models import db, User

auth_bp = Blueprint("auth", __name__)

# ---------------------------
# Helper Functions
# ---------------------------

def validate_request_fields(data, required_fields):
    missing = [field for field in required_fields if field not in data or not data[field]]
    if missing:
        return f"Missing required fields: {', '.join(missing)}"
    return None

# ---------------------------
# Routes
# ---------------------------

@auth_bp.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()
    error = validate_request_fields(data, ["email", "password"])
    if error:
        return jsonify({"error": error}), 400

    if User.query.filter_by(email=data["email"]).first():
        return jsonify({"error": "User already exists"}), 409  # Conflict

    user = User(email=data["email"])
    user.set_password(data["password"])
    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "User created successfully"}), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    error = validate_request_fields(data, ["email", "password"])
    if error:
        return jsonify({"error": error}), 400

    user = User.query.filter_by(email=data["email"]).first()
    if not user or not user.check_password(data["password"]):
        return jsonify({"error": "Invalid email or password"}), 401

    access_token = create_access_token(identity=str(user.id))
    return jsonify({"token": access_token}), 200


@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def me():
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404
        return jsonify({"email": user.email}), 200
    except Exception as e:
        return jsonify({"error": "Failed to fetch user info", "details": str(e)}), 500
