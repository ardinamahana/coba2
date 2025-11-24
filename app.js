// Mock Data Storage
let patientData = [
    {
        id: 'P001',
        name: 'John Doe',
        dob: '1970-03-15',
        age: 54,
        gender: 'male',
        address: '123 Main Street, City',
        diagnosis: 'chronic-kidney-disease',
        dateRegistered: '2024-01-10'
    },
    {
        id: 'P002',
        name: 'Jane Smith',
        dob: '1965-07-22',
        age: 59,
        gender: 'female',
        address: '456 Oak Avenue, Town',
        diagnosis: 'diabetic-nephropathy',
        dateRegistered: '2024-01-12'
    },
    {
        id: 'P003',
        name: 'Michael Johnson',
        dob: '1975-11-08',
        age: 48,
        gender: 'male',
        address: '789 Pine Road, Village',
        diagnosis: 'hypertension',
        dateRegistered: '2024-01-15'
    }
];

let currentUser = null;
let charts = {};

// Login functionality
document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const role = document.getElementById('role').value;
    
    currentUser = {
        email: email,
        role: role
    };
    
    // Show appropriate dashboard
    document.getElementById('login-page').classList.remove('active');
    if (role === 'hospital') {
        document.getElementById('hospital-dashboard').classList.add('active');
        initializeHospitalDashboard();
    } else {
        document.getElementById('health-service-dashboard').classList.add('active');
        initializeHealthServiceDashboard();
    }
});

// Logout functionality
function logout() {
    currentUser = null;
    document.getElementById('login-page').classList.add('active');
    document.getElementById('hospital-dashboard').classList.remove('active');
    document.getElementById('health-service-dashboard').classList.remove('active');
    document.getElementById('login-form').reset();
}

// Initialize Hospital Dashboard
function initializeHospitalDashboard() {
    initializeCharts();
    loadPatientTable();
    setupTabNavigation('hospital');
    setupFormHandlers();
    setupFilters();
}

// Initialize Health Service Dashboard
function initializeHealthServiceDashboard() {
    initializeProvinceCharts();
    setupTabNavigation('health-service');
    setupTimeRangeFilter();
}

// Tab Navigation
function setupTabNavigation(dashboard) {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const tab = this.getAttribute('data-tab');
            
            // Update active nav item
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            // Show appropriate tab content
            const contents = document.querySelectorAll('.tab-content');
            contents.forEach(content => content.classList.remove('active'));
            
            let contentId = '';
            if (dashboard === 'hospital') {
                const tabMap = {
                    'overview': 'overview-content',
                    'input-data': 'input-data-content',
                    'reports': 'reports-content',
                    'settings': 'settings-content'
                };
                contentId = tabMap[tab];
                document.getElementById('page-title').textContent = this.textContent.trim();
            } else {
                const tabMap = {
                    'province-overview': 'province-overview-content',
                    'hospital-list': 'hospital-list-content',
                    'analytics': 'analytics-content',
                    'hs-settings': 'hs-settings-content'
                };
                contentId = tabMap[tab];
                document.getElementById('hs-page-title').textContent = this.textContent.trim();
            }
            
            document.getElementById(contentId).classList.add('active');
        });
    });
}

// Form Handlers
function setupFormHandlers() {
    document.getElementById('patient-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const newPatient = {
            id: 'P' + String(patientData.length + 1).padStart(3, '0'),
            name: document.getElementById('patient-name').value,
            dob: document.getElementById('dob').value,
            age: parseInt(document.getElementById('age').value),
            gender: document.getElementById('gender').value,
            address: document.getElementById('address').value,
            diagnosis: document.getElementById('diagnosis').value,
            dateRegistered: new Date().toISOString().split('T')[0]
        };
        
        patientData.push(newPatient);
        
        // Show success message
        const messageDiv = document.getElementById('form-message');
        messageDiv.textContent = 'Patient registered successfully!';
        messageDiv.className = 'form-message success';
        messageDiv.style.display = 'block';
        
        // Reset form
        this.reset();
        document.getElementById('age').value = '';
        
        // Reload table
        loadPatientTable();
        updateStatistics();
        
        // Hide message after 3 seconds
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 3000);
    });
}

// Calculate age from DOB
function calculateAge() {
    const dobInput = document.getElementById('dob').value;
    if (!dobInput) return;
    
    const dob = new Date(dobInput);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--;
    }
    
    document.getElementById('age').value = age;
}

// Load Patient Table
function loadPatientTable() {
    const tbody = document.getElementById('table-body');
    tbody.innerHTML = '';
    
    patientData.forEach(patient => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${patient.id}</td>
            <td>${patient.name}</td>
            <td>${patient.dob}</td>
            <td>${patient.age}</td>
            <td>${patient.gender}</td>
            <td>${patient.address}</td>
            <td>${formatDiagnosis(patient.diagnosis)}</td>
            <td>${patient.dateRegistered}</td>
        `;
        tbody.appendChild(row);
    });
    
    updateRecordCount();
}

// Setup Filters
function setupFilters() {
    document.getElementById('search-input').addEventListener('input', filterTable);
    document.getElementById('diagnosis-filter').addEventListener('change', filterTable);
}

// Filter Table
function filterTable() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const diagnosisFilter = document.getElementById('diagnosis-filter').value;
    const tbody = document.getElementById('table-body');
    const rows = tbody.getElementsByTagName('tr');
    
    Array.from(rows).forEach(row => {
        const cells = row.getElementsByTagName('td');
        const name = cells[1].textContent.toLowerCase();
        const id = cells[0].textContent.toLowerCase();
        const diagnosis = cells[6].getAttribute('data-diagnosis') || cells[6].textContent;
        
        const matchesSearch = name.includes(searchTerm) || id.includes(searchTerm);
        const matchesDiagnosis = !diagnosisFilter || diagnosis.includes(diagnosisFilter);
        
        row.style.display = (matchesSearch && matchesDiagnosis) ? '' : 'none';
    });
    
    updateRecordCount();
}

// Update Record Count
function updateRecordCount() {
    const tbody = document.getElementById('table-body');
    const visibleRows = Array.from(tbody.getElementsByTagName('tr')).filter(row => row.style.display !== 'none').length;
    document.getElementById('record-count').textContent = `Total Records: ${visibleRows}`;
}

// Initialize Charts
function initializeCharts() {
    // Trends Chart
    const trendsCtx = document.getElementById('trendsChart').getContext('2d');
    charts.trends = new Chart(trendsCtx, {
        type: 'line',
        data: {
            labels: ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'],
            datasets: [{
                label: 'Cases',
                data: [180, 195, 210, 205, 225, 245],
                borderColor: '#1e40af',
                backgroundColor: 'rgba(30, 64, 175, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Diagnosis Chart
    const diagnosisCtx = document.getElementById('diagnosisChart').getContext('2d');
    charts.diagnosis = new Chart(diagnosisCtx, {
        type: 'doughnut',
        data: {
            labels: ['CKD', 'Diabetic', 'Hypertension', 'Glomerulonephritis', 'Other'],
            datasets: [{
                data: [35, 28, 22, 10, 5],
                backgroundColor: [
                    '#1e40af',
                    '#06b6d4',
                    '#10b981',
                    '#f59e0b',
                    '#ef4444'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });

    // Monthly Chart
    const monthlyCtx = document.getElementById('monthlyChart').getContext('2d');
    charts.monthly = new Chart(monthlyCtx, {
        type: 'bar',
        data: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            datasets: [{
                label: 'Cases',
                data: [65, 78, 85, 72],
                backgroundColor: '#1e40af'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    updateStatistics();
}

// Initialize Province Charts
function initializeProvinceCharts() {
    // Province Trends
    const provinceCtx = document.getElementById('provinceTrendsChart').getContext('2d');
    charts.provinceTrends = new Chart(provinceCtx, {
        type: 'line',
        data: {
            labels: ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'],
            datasets: [{
                label: 'Province Cases',
                data: [1800, 1950, 2100, 2050, 2250, 2450],
                borderColor: '#1e40af',
                backgroundColor: 'rgba(30, 64, 175, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Hospital Participation
    const participationCtx = document.getElementById('hospitalParticipationChart').getContext('2d');
    charts.participation = new Chart(participationCtx, {
        type: 'bar',
        data: {
            labels: ['HSP-001', 'HSP-002', 'HSP-003', 'HSP-004', 'HSP-005'],
            datasets: [{
                label: 'Cases',
                data: [1245, 987, 856, 1102, 260],
                backgroundColor: '#1e40af'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Hospital Comparison
    const comparisonCtx = document.getElementById('hospitalComparisonChart').getContext('2d');
    charts.comparison = new Chart(comparisonCtx, {
        type: 'bar',
        data: {
            labels: ['Central', 'Regional', 'St. Mary\'s', 'City General', 'Urban Clinic'],
            datasets: [
                {
                    label: 'Cases',
                    data: [1245, 987, 856, 1102, 260],
                    backgroundColor: '#1e40af'
                },
                {
                    label: 'Patients',
                    data: [156, 123, 98, 134, 45],
                    backgroundColor: '#06b6d4'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Update Statistics
function updateStatistics() {
    document.getElementById('total-cases').textContent = patientData.length;
    const avgAge = (patientData.reduce((sum, p) => sum + p.age, 0) / patientData.length).toFixed(1);
    document.getElementById('avg-age').textContent = avgAge;
    document.getElementById('active-patients').textContent = patientData.length;
    document.getElementById('month-cases').textContent = Math.floor(patientData.length * 0.26);
}

// Setup Time Range Filter
function setupTimeRangeFilter() {
    document.getElementById('time-range-filter').addEventListener('change', function() {
        console.log('Time range changed to:', this.value);
        // Update charts based on selected time range
    });
}

// Format Diagnosis
function formatDiagnosis(diagnosis) {
    const map = {
        'chronic-kidney-disease': 'Chronic Kidney Disease',
        'diabetic-nephropathy': 'Diabetic Nephropathy',
        'hypertension': 'Hypertension',
        'glomerulonephritis': 'Glomerulonephritis',
        'polycystic-kidney': 'Polycystic Kidney Disease',
        'lupus-nephritis': 'Lupus Nephritis',
        'other': 'Other'
    };
    return map[diagnosis] || diagnosis;
}

// Export Data
function exportData(format) {
    const tbody = document.getElementById('table-body');
    const rows = Array.from(tbody.getElementsByTagName('tr')).filter(row => row.style.display !== 'none');
    
    let content = '';
    const headers = ['ID', 'Name', 'DOB', 'Age', 'Gender', 'Address', 'Diagnosis', 'Date Registered'];
    
    if (format === 'csv') {
        content = headers.join(',') + '\n';
        rows.forEach(row => {
            const cells = Array.from(row.cells).map(cell => `"${cell.textContent}"`).join(',');
            content += cells + '\n';
        });
        downloadFile(content, 'patient-records.csv', 'text/csv');
    } else if (format === 'excel') {
        content = headers.join('\t') + '\n';
        rows.forEach(row => {
            const cells = Array.from(row.cells).map(cell => cell.textContent).join('\t');
            content += cells + '\n';
        });
        downloadFile(content, 'patient-records.xlsx', 'text/plain');
    } else if (format === 'pdf') {
        content = 'HAEMODIALYSIS PATIENT RECORDS REPORT\n';
        content += 'Generated on: ' + new Date().toLocaleString() + '\n\n';
        content += headers.join(' | ') + '\n';
        content += '='.repeat(150) + '\n';
        rows.forEach(row => {
            const cells = Array.from(row.cells).map(cell => cell.textContent).join(' | ');
            content += cells + '\n';
        });
        downloadFile(content, 'patient-records.pdf', 'text/plain');
    }
}

// Download File
function downloadFile(content, filename, type) {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:' + type + ';charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', function() {
    // Set demo credentials
    document.getElementById('email').value = 'hospital@demo.com';
});
