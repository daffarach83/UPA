from flask import Flask, request, jsonify, session, current_app, g
from flask_cors import CORS, cross_origin
from flask_session import Session
from pymongo import MongoClient
from config import Config
from functools import wraps
import hashlib
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity, unset_jwt_cookies
from datetime import datetime, timedelta
from werkzeug.utils import secure_filename
import logging
import re
import os
from pymongo.errors import DuplicateKeyError

app = Flask(__name__)
CORS(app, supports_credentials=True)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

app.secret_key = 'UPACARE' 
app.permanent_session_lifetime = timedelta(hours=5)

# MongoDB client setup
client = MongoClient(Config.MONGO_URI)
db = client.UPAcare
laporan_collection = db.laporan
sessions = db['sessions']

# Konfigurasi folder upload
UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


# Secret key for JWT generation
app.config['SECRET_KEY'] = 'UPACARE'

# Hashing function for passwords
def hash_password(password):
    return hashlib.sha256(password.encode('utf-8')).hexdigest()

# Token required 
def token_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split()[1]

        if not token:
            return jsonify({'message': 'Token is missing!'}), 401

        try:
            data = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
            g.current_user = data
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token is expired!'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Invalid token!'}), 401

        return f(*args, **kwargs)
    return decorated_function

# Route for user register
@app.route('/register', methods=['POST'])
def register():
    try:
        data = request.json
        fullname = data.get('fullname')
        email = data.get('email')
        password = data.get('password')
        role = data.get('role', 'Mahasiswa')  # Default role jika tidak dikirim

        # Validate input
        if not fullname or not email or not password or not role:
            return jsonify({'result': 'fail', 'msg': 'All fields are required'}), 400

        # Check if user already exists
        if db.users.find_one({'email': email}):
            return jsonify({'result': 'fail', 'msg': 'User already exists'}), 400

        # Hash the password
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

        # Insert new user into database
        db.users.insert_one({
            'fullname': fullname,
            'email': email,
            'password': hashed_password,
            'role': role
        })

        return jsonify({'result': 'success', 'msg': 'User registered successfully'}), 201

    except Exception as e:
        return jsonify({'result': 'fail', 'msg': str(e)}), 500


#Route to Login
@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        user = db.users.find_one({'email': email})

        if user and bcrypt.check_password_hash(user['password'], password):
            expires = timedelta(hours=5)
            access_token = create_access_token(identity={
                'email': email,
                'user_id': str(user['_id'])
            }, expires_delta=expires)
            expires_in = expires.total_seconds()

            return jsonify({
                'result': 'success',
                'msg': 'Login successful',
                'token': access_token,
                'expiresIn': expires_in,
                'user_id': str(user['_id'])
            }), 200
        else:
            return jsonify({
                'result': 'fail',
                'msg': 'Invalid email or password'
            }), 401

    except Exception as e:
        logging.error(f"Exception occurred: {e}")
        return jsonify({
            'result': 'fail',
            'msg': str(e)
        }), 500

# Route to get user information
@app.route('/get_user_info')
@jwt_required()
def get_user_info():
    identity = get_jwt_identity()  # isi dari access_token
    email = identity.get('email')

    user = db.users.find_one({'email': email}, {'password': 0})
    if not user:
        return jsonify({'result': 'fail', 'msg': 'User not found'}), 404

    return jsonify({'result': 'success', 'user': {
        'fullname': user['fullname'],
        'email': user['email'],
        'role': user.get('role', '')
    }}), 200
        
# Route submit laporan       
@app.route('/api/Addlaporan', methods=['POST'])
def add_laporan():
    try:
        fullname = request.form.get('fullName')
        role = request.form.get('role')
        tanggal = request.form.get('tanggal')
        kodeTiket = request.form.get('kodeTiket')
        lokasi = request.form.get('lokasi')
        barang = request.form.get('barang')
        keterangan = request.form.get('keterangan')

        image_file = request.files.get('image')
        image_url = ''

        print("📥 Data diterima:")
        print({
            "fullname": fullname,
            "role": role,
            "tanggal": tanggal,
            "kodeTiket": kodeTiket,
            "lokasi": lokasi,
            "barang": barang,
            "keterangan": keterangan,
            "image_file": image_file.filename if image_file else None
        })

        if image_file and allowed_file(image_file.filename):
            filename = secure_filename(image_file.filename)
            upload_dir = app.config['UPLOAD_FOLDER']
            os.makedirs(upload_dir, exist_ok=True)  # <-- pastikan folder dibuat
            image_path = os.path.join(upload_dir, filename)
            image_file.save(image_path)
            image_url = f"/{image_path}"

        laporan_data = {
            "fullname": fullname,
            "role": role,
            "tanggal": tanggal,
            "kodeTiket": kodeTiket,
            "lokasi": lokasi,
            "barang": barang,
            "keterangan": keterangan,
            "image_url": image_url
        }

        result = db.laporan.insert_one(laporan_data)
        print(f"✅ Laporan disimpan, ID: {result.inserted_id}")

        return jsonify({'result': 'success', 'msg': 'Laporan berhasil dikirim'}), 200

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({'result': 'fail', 'msg': str(e)}), 500
    
#Route history semua laporan
@app.route('/api/semua_laporan', methods=['GET'])
@jwt_required()
def semua_laporan():
    try:
        laporan = list(db.laporan.find().sort('tanggal', -1))  # urutkan terbaru dulu
        for item in laporan:
            item['_id'] = str(item['_id'])  # ubah ObjectId agar bisa dikirim sebagai JSON
        return jsonify({'result': 'success', 'laporan': laporan}), 200
    except Exception as e:
        return jsonify({'result': 'fail', 'msg': str(e)}), 500
   
#Route history laporan
@app.route('/api/laporan/user', methods=['GET'])
def get_user_laporan():
    full_name = request.args.get('fullName')  # or use user_id if stored
    if not full_name:
        return jsonify({'result': 'fail', 'msg': 'Full name is required'}), 400

    laporan_list = list(db.laporan.find({'fullName': full_name}, {'_id': 0}))
    return jsonify({'result': 'success', 'data': laporan_list}), 200

    
if __name__ == '__main__':
    app.run(debug=True)
