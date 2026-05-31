from flask import Flask, render_template, request, session, redirect, url_for, jsonify, flash, get_flashed_messages
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
import json
import os
import secrets
from backup_manager import BackupManager

app = Flask(__name__)

# Security Configuration
app.secret_key = secrets.token_hex(32)
app.config['SESSION_COOKIE_SECURE'] = True  # Secure cookies over HTTPS
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['PERMANENT_SESSION_LIFETIME'] = 3600

db = SQLAlchemy(app)

# Add security headers
@app.after_request
def set_security_headers(response):
    response.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'SAMEORIGIN'
    response.headers['X-XSS-Protection'] = '1; mode=block'
    response.headers['Referrer-Policy'] = 'strict-origin-when-cross-origin'
    return response

# Initialize Backup Manager
backup_manager = BackupManager()

coins = [
    { 'symbol': 'BTC', 'name': 'Bitcoin', 'price': 69500 },
    { 'symbol': 'ETH', 'name': 'Ethereum', 'price': 3800 },
    { 'symbol': 'BNB', 'name': 'Binance Coin', 'price': 520 },
    { 'symbol': 'ADA', 'name': 'Cardano', 'price': 0.75 },
    { 'symbol': 'SOL', 'name': 'Solana', 'price': 120 },
    { 'symbol': 'XRP', 'name': 'XRP', 'price': 0.62 },
    { 'symbol': 'DOT', 'name': 'Polkadot', 'price': 28.5 },
    { 'symbol': 'DOGE', 'name': 'Dogecoin', 'price': 0.18 },
    { 'symbol': 'AVAX', 'name': 'Avalanche', 'price': 30.2 },
    { 'symbol': 'MATIC', 'name': 'Polygon', 'price': 1.12 },
    { 'symbol': 'LTC', 'name': 'Litecoin', 'price': 95.3 },
    { 'symbol': 'LINK', 'name': 'Chainlink', 'price': 14.1 },
    { 'symbol': 'TRX', 'name': 'TRON', 'price': 0.095 },
    { 'symbol': 'ATOM', 'name': 'Cosmos', 'price': 11.8 },
    { 'symbol': 'NEAR', 'name': 'NEAR Protocol', 'price': 5.5 },
    { 'symbol': 'USDT', 'name': 'Tether', 'price': 1.0 },
    { 'symbol': 'USDC', 'name': 'USD Coin', 'price': 1.0 },
    { 'symbol': 'BCH', 'name': 'Bitcoin Cash', 'price': 280 },
    { 'symbol': 'XLM', 'name': 'Stellar', 'price': 0.16 },
    { 'symbol': 'FIL', 'name': 'Filecoin', 'price': 6.4 }
]

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)
    balance = db.Column(db.Float, default=10000)
    is_admin = db.Column(db.Boolean, default=False)


class Trade(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    pair = db.Column(db.String(50))
    trade_type = db.Column(db.String(10))
    amount = db.Column(db.Float)
    entry_price = db.Column(db.Float)
    exit_price = db.Column(db.Float, nullable=True)
    profit = db.Column(db.Float, default=0)
    status = db.Column(db.String(20), default='OPEN')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class Transaction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    type = db.Column(db.String(50))
    amount = db.Column(db.Float)
    status = db.Column(db.String(20), default='pending')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class Withdrawal(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    wallet_address = db.Column(db.String(300))
    network = db.Column(db.String(50))
    amount = db.Column(db.Float)
    status = db.Column(db.String(20), default='pending')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class Deposit(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    amount = db.Column(db.Float)
    tx_hash = db.Column(db.String(300))
    network = db.Column(db.String(50))
    status = db.Column(db.String(20), default='pending')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class Notification(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    message = db.Column(db.Text)
    is_read = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class Referral(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    referrer_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    referred_user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    commission = db.Column(db.Float, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class AdminLog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    admin_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    action = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class Wallet(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    wallet_type = db.Column(db.String(50))
    address = db.Column(db.String(300))
    balance = db.Column(db.Float, default=0)


class KycDocument(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    document_type = db.Column(db.String(100))
    document_image = db.Column(db.String(300))
    status = db.Column(db.String(20), default='pending')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


with app.app_context():
    db.create_all()


def create_user(username, password, email, is_admin=False):
    user = User(username=username, email=email, password=generate_password_hash(password), is_admin=is_admin)
    db.session.add(user)
    db.session.commit()
    return user

with app.app_context():
    if not User.query.filter_by(username='admin').first():
        create_user('admin', 'zikorebai', 'ebiyorzikorebai247@gmail.com', is_admin=True)


def get_current_username():
    return session.get('username')


def get_current_user():
    user_id = session.get('user_id')
    if not user_id:
        return None
    return User.query.get(user_id)


@app.route('/')
def home():
    if get_current_username():
        return redirect(url_for('dashboard'))
    return redirect(url_for('login'))


@app.route('/register', methods=['GET', 'POST'])
def register():
    error = None
    username_value = ''
    email_value = ''
    if request.method == 'POST':
        username_value = (request.form.get('username') or '').strip()
        email_value = (request.form.get('email') or '').strip()
        password = (request.form.get('password') or '').strip()

        if not username_value or not email_value or not password:
            error = 'Username, email, and password are required.'
        elif User.query.filter_by(username=username_value).first():
            error = 'That username is already taken.'
        elif User.query.filter_by(email=email_value).first():
            error = 'That email is already registered.'
        else:
            new_user = create_user(username_value, password, email_value)
            session['username'] = new_user.username
            session['user_id'] = new_user.id
            return redirect(url_for('dashboard'))

    return render_template('register.html', error=error, username=username_value, email=email_value)


@app.route('/login', methods=['GET', 'POST'])
def login():
    error = None
    identifier = ''
    if request.method == 'POST':
        identifier = (request.form.get('email') or '').strip()
        password = (request.form.get('password') or '').strip()

        if not identifier or not password:
            error = 'Email or username and password are required.'
        else:
            found = User.query.filter_by(username=identifier).first()
            if not found:
                found = User.query.filter_by(email=identifier).first()
            if not found or not check_password_hash(found.password, password):
                error = 'Invalid email/username or password.'
            else:
                session['username'] = found.username
                session['user_id'] = found.id
                return redirect(url_for('dashboard'))

    return render_template('login.html', error=error, identifier=identifier)


@app.route('/signup')
def signup():
    return redirect(url_for('register'))


@app.route('/api/signup', methods=['POST'])
def api_signup():
    payload = request.get_json() or {}
    username = (payload.get('username') or '').strip()
    email = (payload.get('email') or '').strip()
    password = (payload.get('password') or '').strip()
    if not username or not email or not password:
        return jsonify(success=False, error='Username, email, and password are required.')
    if User.query.filter_by(username=username).first():
        return jsonify(success=False, error='Username already exists.')
    if User.query.filter_by(email=email).first():
        return jsonify(success=False, error='Email already exists.')
    new_user = create_user(username, password, email)
    session['username'] = new_user.username
    session['user_id'] = new_user.id
    return jsonify(success=True)


@app.route('/api/login', methods=['POST'])
def api_login():
    payload = request.get_json() or {}
    identifier = (payload.get('identifier') or payload.get('username') or payload.get('email') or '').strip()
    password = (payload.get('password') or '').strip()
    if not identifier or not password:
        return jsonify(success=False, error='Email/username and password are required.')
    found = User.query.filter_by(username=identifier).first()
    if not found:
        found = User.query.filter_by(email=identifier).first()
    if not found or not check_password_hash(found.password, password):
        return jsonify(success=False, error='Invalid credentials.')
    session['username'] = found.username
    session['user_id'] = found.id
    return jsonify(success=True)


@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('login'))


@app.route('/admin')
def admin():
    if 'user_id' not in session:
        return redirect('/login')

    admin_user = User.query.get(session['user_id'])
    if not admin_user or not admin_user.is_admin:
        return 'Access Denied'

    users = User.query.all()
    pending_deposits = Deposit.query.filter_by(status='pending').all()
    confirmed_deposits = Deposit.query.filter_by(status='confirmed').all()
    rejected_deposits = Deposit.query.filter_by(status='rejected').all()
    
    # Calculate statistics
    total_users = len(users)
    total_balance = sum([user.balance for user in users])
    total_pending = sum([d.amount for d in pending_deposits])
    total_confirmed = sum([d.amount for d in confirmed_deposits])
    
    user_list = {user.id: user for user in users}
    messages = get_flashed_messages(with_categories=True)
    
    stats = {
        'total_users': total_users,
        'total_balance': total_balance,
        'pending_deposits': len(pending_deposits),
        'total_pending_amount': total_pending,
        'confirmed_deposits': len(confirmed_deposits),
        'total_confirmed_amount': total_confirmed,
        'rejected_deposits': len(rejected_deposits)
    }
    
    return render_template('admin.html', users=users, pending_deposits=pending_deposits, 
                         confirmed_deposits=confirmed_deposits, rejected_deposits=rejected_deposits,
                         user_list=user_list, messages=messages, stats=stats)


@app.route('/update_balance/<int:user_id>', methods=['POST'])
def update_balance(user_id):
    if 'user_id' not in session:
        return redirect('/login')

    admin_user = User.query.get(session['user_id'])
    if not admin_user or not admin_user.is_admin:
        flash('Access Denied', 'error')
        return redirect('/admin')

    user = User.query.get(user_id)
    if not user:
        flash('User not found.', 'error')
        return redirect('/admin')

    try:
        new_balance = float(request.form['balance'])
    except (ValueError, TypeError):
        flash('Invalid balance value.', 'error')
        return redirect('/admin')

    user.balance = new_balance
    db.session.commit()
    flash(f'Balance updated for {user.username}.', 'success')
    return redirect('/admin')


@app.route('/dashboard')
def dashboard():
    username = get_current_username()
    if not username:
        return redirect(url_for('login'))
    user_record = User.query.filter_by(username=username).first()
    if not user_record:
        return redirect(url_for('login'))
    user = {
        'username': user_record.username,
        'email': user_record.email,
        'balance': user_record.balance
    }
    transactions = Transaction.query.filter_by(user_id=user_record.id).order_by(Transaction.created_at.desc()).limit(5).all()
    messages = get_flashed_messages(with_categories=True)
    return render_template('dashboard.html', user=user, transactions=transactions, messages=messages)


@app.route('/deposit', methods=['POST'])
def deposit():
    current_user = get_current_user()
    if not current_user:
        return redirect(url_for('login'))

    try:
        amount = float(request.form.get('amount', 0))
    except (ValueError, TypeError):
        flash('Enter a valid deposit amount.', 'error')
        return redirect(url_for('dashboard'))

    if amount <= 0:
        flash('Deposit amount must be greater than zero.', 'error')
        return redirect(url_for('dashboard'))

    network = (request.form.get('network') or 'USDT').strip()
    tx_hash = request.form.get('tx_hash') or f"DEP{datetime.utcnow().strftime('%Y%m%d%H%M%S')}"

    # Create deposit with pending status for admin approval
    deposit_record = Deposit(user_id=current_user.id, amount=amount, tx_hash=tx_hash, network=network, status='pending')
    db.session.add(deposit_record)
    db.session.commit()

    flash(f'Deposit of ${amount:,.2f} submitted. Waiting for admin confirmation.', 'info')
    return redirect(url_for('dashboard'))


@app.route('/trades')
def trades():
    current_user = get_current_user()
    if not current_user:
        return redirect(url_for('login'))

    trades = Trade.query.filter_by(user_id=current_user.id).order_by(Trade.created_at.desc()).all()
    return render_template('trades.html', trades=trades, user=current_user)


@app.route('/admin/confirm_deposit/<int:deposit_id>', methods=['POST'])
def confirm_deposit(deposit_id):
    if 'user_id' not in session:
        return redirect('/login')

    admin_user = User.query.get(session['user_id'])
    if not admin_user or not admin_user.is_admin:
        flash('Access Denied', 'error')
        return redirect('/admin')

    deposit = Deposit.query.get(deposit_id)
    if not deposit:
        flash('Deposit not found.', 'error')
        return redirect('/admin')

    if deposit.status != 'pending':
        flash('Only pending deposits can be confirmed.', 'error')
        return redirect('/admin')

    try:
        confirmed_amount = float(request.form.get('amount', deposit.amount))
    except (ValueError, TypeError):
        flash('Invalid amount value.', 'error')
        return redirect('/admin')

    if confirmed_amount <= 0:
        flash('Amount must be greater than zero.', 'error')
        return redirect('/admin')

    # Update deposit
    deposit.amount = confirmed_amount
    deposit.status = 'confirmed'

    # Add funds to user account
    user = User.query.get(deposit.user_id)
    user.balance += confirmed_amount

    # Create transaction record
    transaction_record = Transaction(user_id=deposit.user_id, type='Deposit', amount=confirmed_amount, status='completed')

    # Log admin action
    admin_log = AdminLog(admin_id=admin_user.id, action=f'Confirmed deposit of ${confirmed_amount} for user {user.username} (Deposit ID: {deposit_id})')

    # Create notification for user
    notification = Notification(user_id=deposit.user_id, message=f'Your deposit of ${confirmed_amount:,.2f} has been confirmed and added to your account.')

    db.session.add(transaction_record)
    db.session.add(admin_log)
    db.session.add(notification)
    db.session.commit()

    flash(f'Deposit of ${confirmed_amount:,.2f} confirmed for {user.username}.', 'success')
    return redirect('/admin')


@app.route('/admin/reject_deposit/<int:deposit_id>', methods=['POST'])
def reject_deposit(deposit_id):
    if 'user_id' not in session:
        return redirect('/login')

    admin_user = User.query.get(session['user_id'])
    if not admin_user or not admin_user.is_admin:
        flash('Access Denied', 'error')
        return redirect('/admin')

    deposit = Deposit.query.get(deposit_id)
    if not deposit:
        flash('Deposit not found.', 'error')
        return redirect('/admin')

    if deposit.status != 'pending':
        flash('Only pending deposits can be rejected.', 'error')
        return redirect('/admin')

    reason = (request.form.get('reason') or 'No reason provided').strip()

    # Update deposit status
    deposit.status = 'rejected'

    # Log admin action
    admin_log = AdminLog(admin_id=admin_user.id, action=f'Rejected deposit ID {deposit_id} for user ID {deposit.user_id}. Reason: {reason}')

    # Create notification for user
    user = User.query.get(deposit.user_id)
    notification = Notification(user_id=deposit.user_id, message=f'Your deposit of ${deposit.amount:,.2f} has been rejected. Reason: {reason}')

    db.session.add(admin_log)
    db.session.add(notification)
    db.session.commit()

    flash(f'Deposit rejected for {user.username}.', 'success')
    return redirect('/admin')


@app.route('/admin/deposit_history')
def deposit_history():
    if 'user_id' not in session:
        return redirect('/login')

    admin_user = User.query.get(session['user_id'])
    if not admin_user or not admin_user.is_admin:
        flash('Access Denied', 'error')
        return redirect('/admin')

    # Get all deposits with different statuses
    all_deposits = Deposit.query.order_by(Deposit.created_at.desc()).all()
    user_list = {user.id: user for user in User.query.all()}
    
    return render_template('deposit_history.html', deposits=all_deposits, user_list=user_list)


@app.route('/admin/activity_log')
def activity_log():
    if 'user_id' not in session:
        return redirect('/login')

    admin_user = User.query.get(session['user_id'])
    if not admin_user or not admin_user.is_admin:
        flash('Access Denied', 'error')
        return redirect('/admin')

    # Get all admin activities
    logs = AdminLog.query.order_by(AdminLog.created_at.desc()).all()
    admin_list = {user.id: user for user in User.query.filter_by(is_admin=True).all()}
    
    return render_template('activity_log.html', logs=logs, admin_list=admin_list)


@app.route('/admin/reports')
def admin_reports():
    if 'user_id' not in session:
        return redirect('/login')

    admin_user = User.query.get(session['user_id'])
    if not admin_user or not admin_user.is_admin:
        flash('Access Denied', 'error')
        return redirect('/admin')

    # Calculate reporting data
    all_users = User.query.all()
    all_deposits = Deposit.query.all()
    all_transactions = Transaction.query.all()
    
    # Stats
    total_users = len(all_users)
    total_balance = sum([u.balance for u in all_users])
    
    deposits_by_status = {}
    for status in ['pending', 'confirmed', 'rejected']:
        deposits_by_status[status] = Deposit.query.filter_by(status=status).all()
    
    total_deposits_amount = sum([d.amount for d in all_deposits if d.status == 'confirmed'])
    avg_deposit = total_deposits_amount / len([d for d in all_deposits if d.status == 'confirmed']) if [d for d in all_deposits if d.status == 'confirmed'] else 0
    
    transaction_types = {}
    for t in all_transactions:
        transaction_types[t.type] = transaction_types.get(t.type, 0) + 1
    
    reports = {
        'total_users': total_users,
        'total_balance': total_balance,
        'deposits_by_status': deposits_by_status,
        'total_deposits_amount': total_deposits_amount,
        'avg_deposit': avg_deposit,
        'transaction_types': transaction_types,
        'total_transactions': len(all_transactions)
    }
    
    return render_template('admin_reports.html', reports=reports)


@app.route('/admin/backups')
def admin_backups():
    if 'user_id' not in session:
        return redirect('/login')

    admin_user = User.query.get(session['user_id'])
    if not admin_user or not admin_user.is_admin:
        flash('Access Denied', 'error')
        return redirect('/admin')

    backups = backup_manager.get_backups()
    messages = get_flashed_messages(with_categories=True)
    
    return render_template('admin_backups.html', backups=backups, messages=messages)


@app.route('/admin/create_backup', methods=['POST'])
def create_backup():
    if 'user_id' not in session:
        return redirect('/login')

    admin_user = User.query.get(session['user_id'])
    if not admin_user or not admin_user.is_admin:
        flash('Access Denied', 'error')
        return redirect('/admin/backups')

    if backup_manager.create_backup():
        # Log the action
        admin_log = AdminLog(admin_id=admin_user.id, action='Created manual database backup')
        db.session.add(admin_log)
        db.session.commit()
        flash('✅ Backup created successfully', 'success')
    else:
        flash('❌ Backup creation failed', 'error')
    
    return redirect('/admin/backups')


@app.route('/admin/restore_backup/<backup_filename>', methods=['POST'])
def restore_backup(backup_filename):
    if 'user_id' not in session:
        return redirect('/login')

    admin_user = User.query.get(session['user_id'])
    if not admin_user or not admin_user.is_admin:
        flash('Access Denied', 'error')
        return redirect('/admin/backups')

    if backup_manager.restore_backup(backup_filename):
        # Log the action
        admin_log = AdminLog(admin_id=admin_user.id, action=f'Restored database backup: {backup_filename}')
        db.session.add(admin_log)
        db.session.commit()
        flash(f'✅ Database restored from backup: {backup_filename}', 'success')
    else:
        flash('❌ Backup restoration failed', 'error')
    
    return redirect('/admin/backups')


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        admin = User.query.filter_by(username='admin').first()
        if not admin:
            admin = create_user('admin', 'zikorebai', 'ebiyorzikorebai247@gmail.com', is_admin=True)
        elif not admin.is_admin:
            admin.is_admin = True
            db.session.commit()
        
        # Start automatic backups (every 6 hours)
        print("\n🔄 Starting automatic backup scheduler...")
        backup_manager.schedule_backups(interval_hours=6)
        print("✅ Automatic backups configured (every 6 hours)\n")
    
    # Check for SSL certificates
    cert_file = 'cert.pem'
    key_file = 'key.pem'
    
    if os.path.exists(cert_file) and os.path.exists(key_file):
        print("🔒 Running with HTTPS (SSL/TLS enabled)")
        app.run(host='0.0.0.0', port=5000, debug=False, ssl_context=(cert_file, key_file))
    else:
        print("⚠️ SSL certificates not found. Running without HTTPS.")
        app.run(host='0.0.0.0', port=5000, debug=False)


