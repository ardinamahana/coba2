'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface DataInputFormProps {
  hospital: string
}

export default function DataInputForm({ hospital }: DataInputFormProps) {
  const [formData, setFormData] = useState({
    patientName: '',
    dateOfBirth: '',
    age: '',
    gender: '',
    address: '',
    diagnosis: '',
  })

  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      setFormData({
        patientName: '',
        dateOfBirth: '',
        age: '',
        gender: '',
        address: '',
        diagnosis: '',
      })
      setSubmitted(false)
    }, 2000)
  }

  const calculateAge = (dob: string) => {
    if (dob) {
      const today = new Date()
      const birthDate = new Date(dob)
      let age = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--
      }
      return age.toString()
    }
    return ''
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Patient Case Input</CardTitle>
          <CardDescription>Record a new haemodialysis patient case for {hospital}</CardDescription>
        </CardHeader>
        <CardContent>
          {submitted && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
              ✓ Patient data submitted successfully!
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="patientName">Patient Name *</Label>
                <Input
                  id="patientName"
                  name="patientName"
                  placeholder="Full name"
                  value={formData.patientName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                <Input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => {
                    handleChange(e)
                    const age = calculateAge(e.target.value)
                    setFormData((prev) => ({ ...prev, age }))
                  }}
                  required
                />
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age">Age *</Label>
                <Input id="age" name="age" type="number" placeholder="Auto-calculated" value={formData.age} readOnly className="bg-slate-50" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender *</Label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {/* Row 3 */}
            <div className="space-y-2">
              <Label htmlFor="address">Address *</Label>
              <Input
                id="address"
                name="address"
                placeholder="Patient address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>

            {/* Row 4 */}
            <div className="space-y-2">
              <Label htmlFor="diagnosis">Diagnosis *</Label>
              <select
                id="diagnosis"
                name="diagnosis"
                value={formData.diagnosis}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select diagnosis</option>
                <option value="ckd">Chronic Kidney Disease (CKD)</option>
                <option value="arf">Acute Renal Failure (ARF)</option>
                <option value="diabetes">Diabetes-related Kidney Disease</option>
                <option value="hypertension">Hypertension-related Kidney Disease</option>
                <option value="glomerulonephritis">Glomerulonephritis</option>
                <option value="polycystic">Polycystic Kidney Disease</option>
              </select>
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
              Submit Patient Case
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
