from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from datetime import datetime
import json
import csv
import io
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.units import inch

app = Flask(__name__)
CORS(app)

# In-memory data storage (replace with database in production)
patients_data = []
hospitals_data = {
    'HSP-001': {'name': 'Central Hospital', 'cases': 1245},
    'HSP-002': {'name': 'Regional Medical Center', 'cases': 987},
    'HSP-003': {'name': 'St. Mary\'s Hospital', 'cases': 856},
    'HSP-004': {'name': 'City General Hospital', 'cases': 1102}
}

# Authentication endpoint
@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    role = data.get('role')
    
    if email and role:
        return jsonify({
            'success': True,
            'message': 'Login successful',
            'user': {'email': email, 'role': role}
        })
    
    return jsonify({'success': False, 'message': 'Invalid credentials'}), 401

# Add patient endpoint
@app.route('/api/patients', methods=['POST'])
def add_patient():
    data = request.json
    patient = {
        'id': f"P{len(patients_data) + 1:03d}",
        'name': data.get('name'),
        'dob': data.get('dob'),
        'age': data.get('age'),
        'gender': data.get('gender'),
        'address': data.get('address'),
        'diagnosis': data.get('diagnosis'),
        'date_registered': datetime.now().strftime('%Y-%m-%d')
    }
    patients_data.append(patient)
    return jsonify({'success': True, 'patient': patient})

# Get patients endpoint
@app.route('/api/patients', methods=['GET'])
def get_patients():
    hospital_id = request.args.get('hospital_id')
    filter_diagnosis = request.args.get('diagnosis')
    
    filtered = patients_data
    if filter_diagnosis:
        filtered = [p for p in filtered if p['diagnosis'] == filter_diagnosis]
    
    return jsonify({'patients': filtered})

# Get statistics endpoint
@app.route('/api/statistics', methods=['GET'])
def get_statistics():
    time_range = request.args.get('range', 'monthly')
    
    stats = {
        'total_cases': len(patients_data),
        'active_patients': len(set([p['name'] for p in patients_data])),
        'average_age': sum([p['age'] for p in patients_data]) / len(patients_data) if patients_data else 0,
        'diagnoses': {}
    }
    
    for patient in patients_data:
        diagnosis = patient['diagnosis']
        stats['diagnoses'][diagnosis] = stats['diagnoses'].get(diagnosis, 0) + 1
    
    return jsonify(stats)

# Export to CSV endpoint
@app.route('/api/export/csv', methods=['POST'])
def export_csv():
    data = request.json.get('patients', [])
    
    output = io.StringIO()
    writer = csv.DictWriter(output, fieldnames=['id', 'name', 'dob', 'age', 'gender', 'address', 'diagnosis', 'date_registered'])
    writer.writeheader()
    writer.writerows(data)
    
    response = app.response_class(
        response=output.getvalue(),
        status=200,
        mimetype='text/csv',
        headers={'Content-Disposition': 'attachment; filename=patients.csv'}
    )
    return response

# Export to PDF endpoint
@app.route('/api/export/pdf', methods=['POST'])
def export_pdf():
    data = request.json.get('patients', [])
    
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter)
    elements = []
    
    # Title
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=24,
        textColor=colors.HexColor('#1e40af'),
        spaceAfter=30,
        alignment=1
    )
    elements.append(Paragraph('Haemodialysis Patient Records Report', title_style))
    elements.append(Spacer(1, 0.2*inch))
    
    # Report info
    info_style = ParagraphStyle('Info', parent=styles['Normal'], fontSize=10, textColor=colors.grey)
    elements.append(Paragraph(f'Generated on: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}', info_style))
    elements.append(Spacer(1, 0.3*inch))
    
    # Table data
    table_data = [['ID', 'Name', 'DOB', 'Age', 'Gender', 'Diagnosis']]
    for patient in data:
        table_data.append([
            patient.get('id', ''),
            patient.get('name', ''),
            patient.get('dob', ''),
            str(patient.get('age', '')),
            patient.get('gender', ''),
            patient.get('diagnosis', '')
        ])
    
    table = Table(table_data)
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1e40af')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 10),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
        ('GRID', (0, 0), (-1, -1), 1, colors.black)
    ]))
    
    elements.append(table)
    doc.build(elements)
    
    buffer.seek(0)
    return send_file(buffer, mimetype='application/pdf', as_attachment=True, download_name='patients.pdf')

# Get province overview endpoint
@app.route('/api/province/overview', methods=['GET'])
def get_province_overview():
    time_range = request.args.get('range', 'monthly')
    
    overview = {
        'total_cases': sum([h['cases'] for h in hospitals_data.values()]),
        'active_hospitals': len(hospitals_data),
        'total_patients': len(patients_data),
        'hospitals': hospitals_data
    }
    
    return jsonify(overview)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
