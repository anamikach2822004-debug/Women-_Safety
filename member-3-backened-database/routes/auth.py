from flask import Blueprint, request, jsonify, session
from werkzeug.security import generate_password_hash, check_password_hash
from database.db import get_db

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json() or {}

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not name or not email or not password:
        return jsonify({"error": "All fields are required"}), 400

    if len(password) < 8:
        return jsonify({"error": "Password must be at least 8 characters"}), 400

    conn = get_db()

    try:
        hashed_password = generate_password_hash(password)

        cursor = conn.execute(
            "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
            (name, email, hashed_password)
        )
        conn.commit()

        return jsonify({
            "message": "Registration successful",
            "user_id": cursor.lastrowid
        }), 201

    except Exception:
        return jsonify({"error": "Email may already be registered"}), 409

    finally:
        conn.close()


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json() or {}

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    conn = get_db()
    user = conn.execute(
        "SELECT * FROM users WHERE email = ?", (email,)
    ).fetchone()
    conn.close()

    if user is None or not check_password_hash(user["password"], password):
        return jsonify({"error": "Invalid email or password"}), 401

    session["user_id"] = user["id"]

    return jsonify({
        "message": "Login successful",
        "user": {
            "id": user["id"],
            "name": user["name"],
            "email": user["email"]
        }
    })


@auth_bp.route("/logout", methods=["POST"])
def logout():
    session.clear()
    return jsonify({"message": "Logged out successfully"})