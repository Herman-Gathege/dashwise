from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Appointment

appointments_bp = Blueprint("appointments", __name__)

@appointments_bp.route("/appointments", methods=["POST"])
@jwt_required()
def create_appointment():
    data = request.get_json()
    user_id = get_jwt_identity()

    try:
        new_appointment = Appointment(
            client_name=data["clientName"],
            client_contact=data["clientContact"],
            service=data["service"],
            date=data["date"],
            time=data["time"],
            fee=float(data["fee"]),
            status=data.get('status', 'Scheduled'),
            notes=data.get('notes', ''),
            user_id=user_id
        )
        db.session.add(new_appointment)
        db.session.commit()
        return jsonify({"message": "Appointment created"}), 201
    except Exception as e:
        return jsonify({"error": "Failed to create appointment", "details": str(e)}), 500



@appointments_bp.route("/appointments", methods=["GET"])
@jwt_required()
def get_appointments():
    user_id = get_jwt_identity()
    appointments = Appointment.query.filter_by(user_id=user_id).order_by(Appointment.date).all()
    
    result = [
        {
            "id": appt.id,
            "clientName": appt.client_name,
            "clientContact": appt.client_contact,
            "service": appt.service,
            "date": appt.date,
            "time": appt.time,
            "fee": appt.fee,
            "status": appt.status,
            "notes": appt.notes
            
        }
        for appt in appointments
    ]
    return jsonify(result), 200



@appointments_bp.route("/appointments/<int:appointment_id>", methods=["DELETE"])
@jwt_required()
def delete_appointment(appointment_id):
    user_id = get_jwt_identity()
    appointment = Appointment.query.filter_by(id=appointment_id, user_id=user_id).first()

    if not appointment:
        return jsonify({"error": "Appointment not found or unauthorized"}), 404

    db.session.delete(appointment)
    db.session.commit()
    return jsonify({"message": "Appointment deleted"}), 200

@appointments_bp.route("/appointments/<int:appointment_id>", methods=["PUT"])
@jwt_required()
def update_appointment(appointment_id):
    user_id = get_jwt_identity()
    data = request.get_json()

    appointment = Appointment.query.filter_by(id=appointment_id, user_id=user_id).first()

    if not appointment:
        return jsonify({"error": "Appointment not found or unauthorized"}), 404

    try:
        appointment.client_name = data.get("clientName", appointment.client_name)
        appointment.client_contact = data.get("clientContact", appointment.client_contact)
        appointment.service = data.get("service", appointment.service)
        appointment.date = data.get("date", appointment.date)
        appointment.time = data.get("time", appointment.time)
        appointment.fee = float(data.get("fee", appointment.fee))
        appointment.status = data.get("status", appointment.status)
        appointment.notes = data.get("notes", appointment.notes)


        db.session.commit()
        return jsonify({"message": "Appointment updated"}), 200

    except Exception as e:
        return jsonify({"error": "Failed to update appointment", "details": str(e)}), 500

@appointments_bp.route("/appointments/<int:appointment_id>", methods=["GET"])
@jwt_required()
def get_single_appointment(appointment_id):
    user_id = get_jwt_identity()
    appointment = Appointment.query.filter_by(id=appointment_id, user_id=user_id).first()

    if not appointment:
        return jsonify({"error": "Appointment not found or unauthorized"}), 404

    return jsonify({
        "id": appointment.id,
        "clientName": appointment.client_name,
        "clientContact": appointment.client_contact,
        "service": appointment.service,
        "date": appointment.date,
        "time": appointment.time,
        "fee": appointment.fee,
        "status": appointment.status,
        "notes": appointment.notes
    }), 200
