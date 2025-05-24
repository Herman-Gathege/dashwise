from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Appointment
from sqlalchemy import func

customers_bp = Blueprint('customers', __name__)

# @customers_bp.route('/customers', methods=['GET'])
# @jwt_required()
# def get_customers():
#     user_id = get_jwt_identity()

#     # Group by client name + contact
#     results = (
#         db.session.query(
#             Appointment.client_name,
#             Appointment.client_contact,
#             func.count(Appointment.id).label('total_appointments'),
#             func.count(
#                 func.nullif(Appointment.status != 'Complete', True)
#             ).label('completed_appointments')
#         )
#         .filter_by(user_id=user_id)
#         .group_by(Appointment.client_name, Appointment.client_contact)
#         .all()
#     )

#     customers = [
#         {
#             "clientName": r.client_name,
#             "clientContact": r.client_contact,
#             "totalAppointments": r.total_appointments,
#             "completedAppointments": r.completed_appointments
#         }
#         for r in results
#     ]
#     return jsonify(customers), 200

# @customers_bp.route('/customers', methods=['DELETE'])
# @jwt_required()
# def delete_customer():
#     user_id = get_jwt_identity()
#     data = request.get_json()

#     name = data.get("clientName")
#     contact = data.get("clientContact")

#     if not name or not contact:
#         return jsonify({"error": "Missing clientName or clientContact"}), 400

#     # Find appointments matching this customer
#     appointments = Appointment.query.filter_by(
#         user_id=user_id,
#         client_name=name,
#         client_contact=contact
#     ).all()

#     if not appointments:
#         return jsonify({"error": "Customer not found"}), 404

#     for appt in appointments:
#         db.session.delete(appt)

#     db.session.commit()
#     return jsonify({"message": f"Deleted {len(appointments)} appointments for {name}"}), 200

@customers_bp.route('/customers', methods=['GET', 'DELETE'])
@jwt_required()
def handle_customers():
    user_id = get_jwt_identity()

    if request.method == 'GET':
        # Group by client name + contact
        results = (
            db.session.query(
                Appointment.client_name,
                Appointment.client_contact,
                func.count(Appointment.id).label('total_appointments'),
                func.count(
                    func.nullif(Appointment.status != 'Complete', True)
                ).label('completed_appointments')
            )
            .filter_by(user_id=user_id)
            .group_by(Appointment.client_name, Appointment.client_contact)
            .all()
        )

        customers = [
            {
                "clientName": r.client_name,
                "clientContact": r.client_contact,
                "totalAppointments": r.total_appointments,
                "completedAppointments": r.completed_appointments
            }
            for r in results
        ]
        return jsonify(customers), 200

    elif request.method == 'DELETE':
        data = request.get_json()
        name = data.get("clientName")
        contact = data.get("clientContact")

        if not name or not contact:
            return jsonify({"error": "Missing clientName or clientContact"}), 400

        appointments = Appointment.query.filter_by(
            user_id=user_id,
            client_name=name,
            client_contact=contact
        ).all()

        if not appointments:
            return jsonify({"error": "Customer not found"}), 404

        for appt in appointments:
            db.session.delete(appt)

        db.session.commit()
        return jsonify({"message": f"Deleted {len(appointments)} appointments for {name}"}), 200


@customers_bp.route('/customers/edit', methods=['PUT'])
@jwt_required()
def edit_customer():
    user_id = get_jwt_identity()
    data = request.get_json()

    old_name = data.get("oldClientName")
    old_contact = data.get("oldClientContact")
    new_name = data.get("newClientName")
    new_contact = data.get("newClientContact")

    if not old_name or not old_contact or not new_name or not new_contact:
        return jsonify({"error": "Missing old or new customer info"}), 400

    # Find appointments for this customer
    appointments = Appointment.query.filter_by(
        user_id=user_id,
        client_name=old_name,
        client_contact=old_contact
    ).all()

    if not appointments:
        return jsonify({"error": "Customer not found"}), 404

    # Update all matched appointments
    for appt in appointments:
        appt.client_name = new_name
        appt.client_contact = new_contact

    db.session.commit()
    return jsonify({"message": f"Updated {len(appointments)} appointments"}), 200
