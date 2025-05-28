from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity
from flask_jwt_extended import jwt_required

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


@auth_bp.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh():
    user_id = get_jwt_identity()
    new_access_token = create_access_token(identity=user_id)
    return jsonify(access_token=new_access_token), 200


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


# @auth_bp.route("/login", methods=["POST"])
# def login():
#     data = request.get_json()
#     error = validate_request_fields(data, ["email", "password"])
#     if error:
#         return jsonify({"error": error}), 400

#     user = User.query.filter_by(email=data["email"]).first()
#     if not user or not user.check_password(data["password"]):
#         return jsonify({"error": "Invalid email or password"}), 401

#     access_token = create_access_token(identity=str(user.id))
#     return jsonify({"token": access_token}), 200

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
    refresh_token = create_refresh_token(identity=str(user.id))

    return jsonify({
        "access_token": access_token,
        "refresh_token": refresh_token
    }), 200



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


@auth_bp.route("/change-password", methods=["POST"])
@jwt_required()
def change_password():
    user_id = get_jwt_identity()
    data = request.get_json()
    current = data.get("currentPassword")
    new = data.get("newPassword")

    user = User.query.get(user_id)

    if not user or not user.check_password(current):
        return jsonify({"error": "Incorrect current password"}), 400

    user.set_password(new)
    db.session.commit()

    return jsonify({"message": "Password changed successfully"}), 200
