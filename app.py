from flask import Flask, render_template, request, jsonify
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from string import Template

app = Flask(__name__)

# Configurações de e-mail
EMAIL_FROM = "viniciusonrj@gmail.com"
EMAIL_TO = "viniciusonrj@gmail.com"
EMAIL_PASSWORD = "SUA_SENHA_DE_APP_AQUI"
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/send_email", methods=["POST"])
def send_email():
    try:
        data = request.get_json()
        name = data.get("name")
        email = data.get("email")
        message = data.get("message")

        # Monta o e-mail HTML usando Template (evita erro de f-string)
        email_template = Template("""
        <html>
          <body style="font-family: Arial, sans-serif; background-color:#f8f9fa; padding:20px;">
            <h2 style="color:#007bff;">Nova mensagem de contato</h2>
            <p><strong>Nome:</strong> $name</p>
            <p><strong>Email:</strong> $email</p>
            <p><strong>Mensagem:</strong></p>
            <p style="white-space: pre-line;">$message</p>
          </body>
        </html>
        """)

        html_content = email_template.substitute(name=name, email=email, message=message)

        # Configura o e-mail
        msg = MIMEMultipart("alternative")
        msg["From"] = EMAIL_FROM
        msg["To"] = EMAIL_TO
        msg["Subject"] = f"Contato via site - {name}"

        msg.attach(MIMEText(html_content, "html"))

        # Envia o e-mail
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(EMAIL_FROM, EMAIL_PASSWORD)
            server.send_message(msg)

        return jsonify({"status": "success", "message": "Mensagem enviada com sucesso!"})

    except Exception as e:
        print("Erro ao enviar e-mail:", e)
        return jsonify({"status": "error", "message": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)
