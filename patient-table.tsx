'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

const patientData = [
  {
    id: '001',
    name: 'Ahmed Hassan',
    dateOfBirth: '1965-03-15',
    age: 59,
    gender: 'Male',
    address: '123 Main St, City',
    diagnosis: 'CKD',
  },
  {
    id: '002',
    name: 'Fatima Ali',
    dateOfBirth: '1970-07-22',
    age: 54,
    gender: 'Female',
    address: '456 Oak Ave, City',
    diagnosis: 'Diabetes',
  },
  {
    id: '003',
    name: 'Mohammed Ibrahim',
    dateOfBirth: '1955-11-08',
    age: 69,
    gender: 'Male',
    address: '789 Pine Rd, City',
    diagnosis: 'Hypertension',
  },
  {
    id: '004',
    name: 'Noor Abdulla',
    dateOfBirth: '1975-01-30',
    age: 49,
    gender: 'Female',
    address: '321 Elm St, City',
    diagnosis: 'ARF',
  },
  {
    id: '005',
    name: 'Karim Khan',
    dateOfBirth: '1960-05-12',
    age: 64,
    gender: 'Male',
    address: '654 Maple Dr, City',
    diagnosis: 'CKD',
  },
]

export default function PatientTable() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterDiagnosis, setFilterDiagnosis] = useState<string | null>(null)
  const [exportingFormat, setExportingFormat] = useState<string | null>(null)

  const filteredData = patientData.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.id.includes(searchTerm)
    const matchesDiagnosis = !filterDiagnosis || patient.diagnosis === filterDiagnosis
    return matchesSearch && matchesDiagnosis
  })

  const exportToCSV = () => {
    setExportingFormat('csv')
    const headers = ['ID', 'Name', 'Date of Birth', 'Age', 'Gender', 'Address', 'Diagnosis']
    const csvContent = [
      headers.join(','),
      ...filteredData.map((row) =>
        [
          row.id,
          `"${row.name}"`,
          row.dateOfBirth,
          row.age,
          row.gender,
          `"${row.address}"`,
          row.diagnosis,
        ].join(','),
      ),
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `patient-report-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    setTimeout(() => setExportingFormat(null), 1000)
  }

  const exportToExcel = () => {
    setExportingFormat('excel')
    const headers = ['ID', 'Name', 'Date of Birth', 'Age', 'Gender', 'Address', 'Diagnosis']
    const rows = filteredData.map((row) => [
      row.id,
      row.name,
      row.dateOfBirth,
      row.age,
      row.gender,
      row.address,
      row.diagnosis,
    ])

    const sheet = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join('\t'))
      .join('\n')

    const blob = new Blob([sheet], { type: 'application/vnd.ms-excel;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `patient-report-${new Date().toISOString().split('T')[0]}.xlsx`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    setTimeout(() => setExportingFormat(null), 1000)
  }

  const exportToPDF = () => {
    setExportingFormat('pdf')
    let pdfContent = 'PATIENT HAEMODIALYSIS REPORT\n'
    pdfContent += `Generated: ${new Date().toLocaleString()}\n`
    pdfContent += '='.repeat(80) + '\n\n'

    pdfContent += 'ID\tName\t\t\tDOB\t\tAge\tGender\tDiagnosis\n'
    pdfContent += '-'.repeat(80) + '\n'

    filteredData.forEach((patient) => {
      pdfContent += `${patient.id}\t${patient.name}\t${patient.dateOfBirth}\t${patient.age}\t${patient.gender}\t${patient.diagnosis}\n`
    })

    const blob = new Blob([pdfContent], { type: 'text/plain;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `patient-report-${new Date().toISOString().split('T')[0]}.pdf`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    setTimeout(() => setExportingFormat(null), 1000)
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Search by name or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={filterDiagnosis || ''}
          onChange={(e) => setFilterDiagnosis(e.target.value || null)}
          className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Diagnoses</option>
          <option value="CKD">CKD</option>
          <option value="ARF">ARF</option>
          <option value="Diabetes">Diabetes</option>
          <option value="Hypertension">Hypertension</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-slate-200 rounded-lg">
        <table className="w-full">
          <thead className="bg-slate-100 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">ID</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Date of Birth</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Age</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Gender</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Diagnosis</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((patient, index) => (
              <tr
                key={patient.id}
                className={`border-b border-slate-200 hover:bg-slate-50 transition-colors ${
                  index % 2 === 0 ? 'bg-white' : 'bg-slate-50'
                }`}
              >
                <td className="px-6 py-3 text-sm text-slate-900">{patient.id}</td>
                <td className="px-6 py-3 text-sm text-slate-900 font-medium">{patient.name}</td>
                <td className="px-6 py-3 text-sm text-slate-600">{patient.dateOfBirth}</td>
                <td className="px-6 py-3 text-sm text-slate-600">{patient.age}</td>
                <td className="px-6 py-3 text-sm text-slate-600">{patient.gender}</td>
                <td className="px-6 py-3 text-sm">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {patient.diagnosis}
                  </span>
                </td>
                <td className="px-6 py-3 text-sm">
                  <button className="text-blue-600 hover:text-blue-800 font-medium">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Export Buttons */}
      <div className="flex gap-2 flex-wrap">
        <Button
          variant="outline"
          onClick={exportToCSV}
          disabled={filteredData.length === 0}
          className={exportingFormat === 'csv' ? 'bg-green-50 border-green-300' : ''}
        >
          {exportingFormat === 'csv' ? '✓ CSV Downloaded' : 'Download CSV'}
        </Button>
        <Button
          variant="outline"
          onClick={exportToExcel}
          disabled={filteredData.length === 0}
          className={exportingFormat === 'excel' ? 'bg-green-50 border-green-300' : ''}
        >
          {exportingFormat === 'excel' ? '✓ Excel Downloaded' : 'Download Excel'}
        </Button>
        <Button
          variant="outline"
          onClick={exportToPDF}
          disabled={filteredData.length === 0}
          className={exportingFormat === 'pdf' ? 'bg-green-50 border-green-300' : ''}
        >
          {exportingFormat === 'pdf' ? '✓ PDF Downloaded' : 'Download PDF'}
        </Button>
      </div>

      {/* Data Summary */}
      <div className="mt-4 p-4 bg-slate-50 rounded-lg">
        <p className="text-sm text-slate-600">
          Showing <span className="font-semibold text-slate-900">{filteredData.length}</span> of{' '}
          <span className="font-semibold text-slate-900">{patientData.length}</span> records
        </p>
      </div>
    </div>
  )
}
