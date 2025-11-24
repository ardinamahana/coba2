import sqlite3
from datetime import datetime

class Database:
    def __init__(self, db_name='haemodialysis.db'):
        self.connection = sqlite3.connect(db_name, check_same_thread=False)
        self.cursor = self.connection.cursor()
        self.init_tables()
    
    def init_tables(self):
        # Create hospitals table
        self.cursor.execute('''
            CREATE TABLE IF NOT EXISTS hospitals (
                hospital_id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                address TEXT,
                phone TEXT,
                email TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Create users table
        self.cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                user_id TEXT PRIMARY KEY,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                role TEXT NOT NULL,
                hospital_id TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY(hospital_id) REFERENCES hospitals(hospital_id)
            )
        ''')
        
        # Create patients table
        self.cursor.execute('''
            CREATE TABLE IF NOT EXISTS patients (
                patient_id TEXT PRIMARY KEY,
                hospital_id TEXT NOT NULL,
                name TEXT NOT NULL,
                date_of_birth DATE NOT NULL,
                age INTEGER,
                gender TEXT,
                address TEXT,
                diagnosis TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY(hospital_id) REFERENCES hospitals(hospital_id)
            )
        ''')
        
        # Create reports table
        self.cursor.execute('''
            CREATE TABLE IF NOT EXISTS reports (
                report_id TEXT PRIMARY KEY,
                hospital_id TEXT NOT NULL,
                report_type TEXT NOT NULL,
                time_range TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY(hospital_id) REFERENCES hospitals(hospital_id)
            )
        ''')
        
        self.connection.commit()
    
    def add_patient(self, patient_id, hospital_id, name, dob, age, gender, address, diagnosis):
        self.cursor.execute('''
            INSERT INTO patients (patient_id, hospital_id, name, date_of_birth, age, gender, address, diagnosis)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (patient_id, hospital_id, name, dob, age, gender, address, diagnosis))
        self.connection.commit()
        return True
    
    def get_patients_by_hospital(self, hospital_id, filter_diagnosis=None):
        if filter_diagnosis:
            self.cursor.execute('''
                SELECT * FROM patients WHERE hospital_id = ? AND diagnosis = ?
            ''', (hospital_id, filter_diagnosis))
        else:
            self.cursor.execute('SELECT * FROM patients WHERE hospital_id = ?', (hospital_id,))
        
        return self.cursor.fetchall()
    
    def get_all_patients(self):
        self.cursor.execute('SELECT * FROM patients')
        return self.cursor.fetchall()
    
    def get_statistics(self, hospital_id=None, time_range='monthly'):
        if hospital_id:
            self.cursor.execute('SELECT COUNT(*) FROM patients WHERE hospital_id = ?', (hospital_id,))
        else:
            self.cursor.execute('SELECT COUNT(*) FROM patients')
        
        total_cases = self.cursor.fetchone()[0]
        return {'total_cases': total_cases}
    
    def close(self):
        self.connection.close()
