from app import app, User, db
from werkzeug.security import check_password_hash

with app.app_context():
    admin = User.query.filter_by(username='admin').first()
    if admin:
        test_password = 'zikorebai'
        password_correct = check_password_hash(admin.password, test_password)
        print(f'Admin password hash: {admin.password[:50]}...')
        print(f'Testing password "{test_password}": {password_correct}')
        
        # Try all test scenarios
        test_cases = [
            ('ebiyorzikorebai247@gmail.com', 'zikorebai'),
            ('admin', 'zikorebai'),
        ]
        
        for email, pwd in test_cases:
            found = User.query.filter_by(username=email).first()
            if not found:
                found = User.query.filter_by(email=email).first()
            if found:
                is_correct = check_password_hash(found.password, pwd)
                print(f'Testing {email}:{pwd} -> {is_correct}')
