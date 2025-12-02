import argparse, os, sys
from datetime import datetime


try:
    import firebase_admin
    from firebase_admin import credentials, firestore
except ImportError:
    print("firebase_admin not installed. Run: pip install firebase-admin")
    sys.exit(1)


MOCK_USERS = [
{"id": "admin1", "role": "admin", "name": "Dr. Evelyn Reed", "email": "admin@ipa.edu"},
{"id": "teacher1", "role": "teacher", "name": "Ms. Clara Johnson", "email": "teacher@ipa.edu"},
{"id": "student1", "role": "student", "name": "Alex Thompson", "studentId": "S1001", "isBiometricConsentGiven": False},
{"id": "parent1", "role": "parent", "name": "Mr. David Thompson", "linkedStudentId": "S1001"},
]


MOCK_STUDENTS = [
{"studentId": "S1001", "name": "Alex Thompson", "points": 1250, "badges": ["Punctuality Master", "Weekly Star"], "consistencyScore": 92},
{"studentId": "S1002", "name": "Bella Cruz", "points": 800, "badges": ["Weekly Star"], "consistencyScore": 78},
{"studentId": "S1003", "name": "Chris Lee", "points": 450, "badges": [], "consistencyScore": 55},
]


def init_firebase(creds_path=None, project=None):
    if creds_path:
        cred = credentials.Certificate(creds_path)
        firebase_admin.initialize_app(cred, {"projectId": project} if project else None)
    else:
        firebase_admin.initialize_app()
    return firestore.client()


def seed_users(db, prefix):
    col = db.collection(prefix + 'users')
    for user in MOCK_USERS:
        print(f"Seeding user: {user['id']}")
        col.document(user['id']).set(user, merge=True)


def seed_students(db, prefix):
    col = db.collection(prefix + 'students_data')
    for student in MOCK_STUDENTS:
        print(f"Seeding student: {student['studentId']}")
        col.document(student['studentId']).set(student, merge=True)


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--creds', help='Path to Firebase service account JSON')
    parser.add_argument('--project', help='Firebase project ID')
    args = parser.parse_args()


    creds = args.creds or os.environ.get('GOOGLE_APPLICATION_CREDENTIALS')
    project = args.project or 'ipa-system-54629'

    db = init_firebase(creds, project)
    prefix = f"artifacts/{project}/public/data/"

    seed_users(db, prefix)
    seed_students(db, prefix)
    print('✅ Firestore demo data seeded successfully.')