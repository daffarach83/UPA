import os
from dotenv import load_dotenv
load_dotenv()

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'UPACARE'
    MONGO_URI = os.environ.get('MONGODB_URI')
    SESSION_TYPE = 'filesystem'  # Example session type
    TOKEN_KEY = 'UPACareUnit'
    UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploads')  # Menggunakan path relatif
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # Limit file uploads to 16MB
    
# # Flask-Mail configuration
#     MAIL_SERVER = 'smtp.example.com'
#     MAIL_PORT = 587
#     MAIL_USE_TLS = False
#     MAIL_USE_SSL = True
#     MAIL_USERNAME = 'your-email@example.com'
#     MAIL_PASSWORD = os.environ.get('PASSWORD')
