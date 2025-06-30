from flask import Flask, request, jsonify, session
from flask_cors import CORS, cross_origin
from flask_session import Session
from pymongo import MongoClient
from config import Config
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity, unset_jwt_cookies
from datetime import datetime, timedelta
from werkzeug.utils import secure_filename
import logging
import re
import os
from pymongo.errors import DuplicateKeyError

app = Flask(__name__)
CORS(app)
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
ALLOWED_EXTENSIONS = {'jpg', 'jpeg', 'png'}

# Secret key for JWT generation
app.config['SECRET_KEY'] = 'UPACARE'

# Route to Register
@app.route('/register', methods=['POST'])
def register():
    try:
        data = request.json
        print(f"Received data: {data}")

        email = data.get('email', '').strip().lower()
        fullname = data.get('fullname', '').strip()
        password = data.get('password', '').strip()

        # Validasi input
        if not email or not fullname or not password:
            return jsonify({'result': 'fail', 'msg': 'Semua field wajib diisi'}), 400

        # Validasi email hanya @mhsw.pnj.ac.id
        if not re.match(r'^[\w\.-]+@[\w\.-]+\.\w+$', email):
            return jsonify({'result': 'fail', 'msg': 'Format email tidak valid'}), 400

        # Cek jika email sudah digunakan
        if db.users.find_one({'email': email}):
            return jsonify({'result': 'fail', 'msg': 'Email sudah terdaftar'}), 400

        # Simpan ke DB
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
        db.users.insert_one({
            'email': email,
            'fullname': fullname,
            'password': hashed_password
        })

        return jsonify({'result': 'success', 'msg': 'Registrasi berhasil'}), 201

    except DuplicateKeyError:
        return jsonify({'result': 'fail', 'msg': 'Email sudah digunakan'}), 400
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'result': 'fail', 'msg': 'Terjadi kesalahan server'}), 500



# Route to Login
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email', '').strip().lower()
    password = data.get('password', '').strip()

    user = db.users.find_one({'email': email})
    if not user:
        return jsonify({'result': 'fail', 'msg': 'Email tidak terdaftar'}), 401

    if not bcrypt.check_password_hash(user['password'], password):
        return jsonify({'result': 'fail', 'msg': 'Password salah'}), 401

    # Simpan data ke session
    session.permanent = True
    session['user'] = {
        'email': user['email'],
        'fullname': user['fullname'],
        'role': user.get('role', 'Mahasiswa'),
        'jurusan': user.get('jurusan', 'Teknik Informatika'),
        'kelas': user.get('kelas', 'TI-3A')
    }

    return jsonify({
        'result': 'success',
        'msg': 'Login berhasil',
        'user': session['user']
    }), 200

# Route submit laporan       
@app.route('/api/Addlaporan', methods=['POST'])
def submit_laporan():
    try:
        form = request.form
        image = request.files.get('image')

        # Validate required fields
        required_fields = ['tanggal', 'kodeTiket', 'lokasi', 'barang', 'keterangan', 'fullName', 'role']
        for field in required_fields:
            if not form.get(field):
                return jsonify({'result': 'fail', 'msg': f'{field} is required'}), 400

        # Handle image upload
        image_path = None
        if image:
            if not allowed_file(image.filename):
                return jsonify({'result': 'fail', 'msg': 'Only JPG, JPEG, and PNG files are allowed'}), 400
            filename = secure_filename(f"{form.get('kodeTiket')}_{image.filename}")
            image_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            image.save(image_path)

        # Save report to MongoDB
        laporan = {
            'tanggal': form.get('tanggal'),
            'kodeTiket': form.get('kodeTiket'),
            'lokasi': form.get('lokasi'),
            'barang': form.get('barang'),
            'keterangan': form.get('keterangan'),
            'fullName': form.get('fullName'),
            'role': form.get('role'),
            'image': image_path,
            'createdAt': datetime.utcnow()
        }

        laporan_collection.insert_one(laporan)

        return jsonify({'result': 'success', 'msg': 'Laporan berhasil dikirim'}), 201

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
