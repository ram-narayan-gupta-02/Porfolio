# server.py
import os
from dotenv import load_dotenv
from flask import Flask, request, jsonify, render_template
from flask_mail import Mail, Message
from flask_cors import CORS

load_dotenv()

app = Flask(__name__, static_folder='static', template_folder='templates')
# allow your frontend origin(s) if needed; "*" ok for local dev
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Mail config (Gmail recommended to use App Password)
app.config.update(
    MAIL_SERVER=os.getenv("MAIL_SERVER", "smtp.gmail.com"),
    MAIL_PORT=int(os.getenv("MAIL_PORT", 587)),
    MAIL_USE_TLS=os.getenv("MAIL_USE_TLS", "True") == "True",
    MAIL_USERNAME=os.getenv("SENDER_EMAIL"),
    MAIL_PASSWORD=os.getenv("APP_PASSWORD"),
    MAIL_DEFAULT_SENDER=os.getenv("SENDER_EMAIL")
)

mail = Mail(app)
OWNER_EMAIL = os.getenv("OWNER_EMAIL", "ramnrngupta@gmail.com")

@app.route('/')
def home():
    return render_template("index.html")

# Accept POST (and a GET for quick browser info)
@app.route('/api/send-email', methods=['GET', 'POST'])
def send_email():
    if request.method == 'GET':
        return jsonify({"info": "Send a POST request to this endpoint with JSON {name,email,subject,message}"}), 200

    try:
        data = request.get_json(force=True)
    except Exception:
        return jsonify({"error": "Invalid or missing JSON body"}), 400

    name = (data.get('name') or "").strip()
    email = (data.get('email') or "").strip()
    subject = (data.get('subject') or "No subject").strip()
    message_content = (data.get('message') or "").strip()

    if not all([name, email, subject, message_content]):
        return jsonify({"error": "name, email and message are required"}), 400

    # Email to owner
    owner_msg = Message(
        subject=f"Portfolio Contact: {subject}",
        recipients=[OWNER_EMAIL],
        html=f"""
            <h3>New message from your portfolio</h3>
            <p><strong>Name:</strong> {name}</p>
            <p><strong>Email:</strong> {email}</p>
            <p><strong>Subject:</strong> {subject}</p>
            <p><strong>Message:</strong></p>
            <p>{message_content}</p>
        """
    )
    owner_msg.extra_headers = {"Reply-To": email}

    # Confirmation email to sender
    confirmation_msg = Message(
        subject="✅ Thanks — I've received your message",
        recipients=[email],
        html=f"""
            <h3>Thanks for contacting Ram</h3>
            <p>Hi {name},</p>
            <p>I received your message and will reply soon.</p>
            <p><strong>Subject:</strong></p>
            <p><strong>Your message:</strong></p>
            <blockquote>{message_content}</blockquote>
            <p>— Ram Narayan Gupta</p>
        """
    )

    try:
        mail.send(owner_msg)
        mail.send(confirmation_msg)
    except Exception as e:
        app.logger.exception("Failed to send email")
        return jsonify({"error": "Failed to send email", "details": str(e)}), 500

    return jsonify({"success": True, "message": "Emails sent."}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
