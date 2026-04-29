'use client'

import { useEffect, useState } from 'react'
import { Users, User, Circle } from 'lucide-react'
import { apiFetch } from '@/lib/api'

interface Employee {
  id: number
  name: string
  email: string
  job_title?: string
  department?: string
  status?: string
}

interface EmployeesListProps {
  setActiveSection: (section: string) => void
}

export default function EmployeesList({}: EmployeesListProps) {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEmployees()
  }, [])

  const fetchEmployees = async () => {
    try {
      setLoading(true)
      const response = await apiFetch('/supervisor/employees', { method: 'GET' })
      const result = await response.json()
      if (result.success) {
        setEmployees(result.data || [])
      }
    } catch (error) {
      console.error('Error fetching employees:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'online':
        return 'bg-green-500'
      case 'offline':
        return 'bg-gray-400'
      case 'busy':
        return 'bg-red-500'
      default:
        return 'bg-gray-300'
    }
  }

  return (
    <div className="w-full space-y-4">
      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-br from-[#eef7ff] to-[#e2f5f1] p-5 shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <Users className="h-5 w-5 text-[#1a472a]" />
          <h2 className="text-lg font-bold text-[#1a472a]">Team Members</h2>
        </div>
        <p className="text-sm text-gray-600">
          {employees.length} employee{employees.length !== 1 ? 's' : ''} in your team
        </p>
      </div>

      {/* Employees Grid */}
      {loading ? (
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-20 rounded-2xl bg-gray-100 animate-pulse"
            />
          ))}
        </div>
      ) : employees.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 p-6 text-center">
          <User className="h-8 w-8 mx-auto text-gray-400 mb-2" />
          <p className="text-sm text-gray-500">No employees found</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
          {employees.map((employee) => (
            <div
              key={employee.id}
              className="group rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition hover:shadow-md hover:border-[#1a472a]/20"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {employee.name}
                    </h3>
                    <Circle
                      className={`h-2 w-2 flex-shrink-0 ${getStatusColor(employee.status)}`}
                      fill="currentColor"
                    />
                  </div>
                  <p className="text-xs text-gray-500 truncate">{employee.email}</p>
                  {employee.job_title && (
                    <p className="text-xs text-gray-600 mt-1">{employee.job_title}</p>
                  )}
                  {employee.department && (
                    <p className="text-xs text-gray-500">{employee.department}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
