from flask import Blueprint, request, jsonify, session
from database.db import get_db
from routes.utils import login_required

incidents_bp = Blueprint("incidents", __name__)

@incidents_bp.route("/incidents", methods=["POST"])
@login_required
def add_incident():
    data = request.get_json() or {}

    description = data.get("description")
    latitude = data.get("latitude")
    longitude = data.get("longitude")

    if not description:
        return jsonify({"error": "Description is required"}), 400

    conn = get_db()
    cursor = conn.execute(
        """INSERT INTO incidents
        (user_id, description, latitude, longitude)
        VALUES (?, ?, ?, ?)""",
        (session["user_id"], description, latitude, longitude)
    )
    conn.commit()
    incident_id = cursor.lastrowid
    conn.close()

    return jsonify({
        "message": "Incident recorded successfully",
        "incident_id": incident_id
    }), 201


@incidents_bp.route("/incidents", methods=["GET"])
@login_required
def get_incidents():
    conn = get_db()
    incidents = conn.execute(
        """SELECT id, description, latitude, longitude, created_at
        FROM incidents WHERE user_id = ?
        ORDER BY created_at DESC""",
        (session["user_id"],)
    ).fetchall()
    conn.close()

    return jsonify([dict(incident) for incident in incidents])