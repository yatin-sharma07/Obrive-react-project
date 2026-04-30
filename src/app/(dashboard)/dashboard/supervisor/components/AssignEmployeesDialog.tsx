'use client'

import Image from 'next/image'
import supportImg from '@/assets/images/employee/illustration.png'
import { useState, useEffect } from 'react'
import { apiFetch } from '@/lib/api'

interface AssignEmployeesDialogProps {
  open: boolean
  onClose: () => void
  project: any
  onAssign: (employeeIds: number[]) => void
}

interface Employee {
  id: number
  name: string
  email: string
  job_title?: string
  department?: string
}

export default function AssignEmployeesDialog({
  open,
  onClose,
  project,
  onAssign,
}: AssignEmployeesDialogProps) {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<number[]>([])
  const [loading, setLoading] = useState(false)
  const [assigning, setAssigning] = useState(false)

  const currentMembers = project?.team_members || []

  useEffect(() => {
    if (open) {
      fetchEmployees()
    }
  }, [open])

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedEmployeeIds.length === 0) return

    try {
      setAssigning(true)
      await onAssign(selectedEmployeeIds)
      setSelectedEmployeeIds([])
    } finally {
      setAssigning(false)
    }
  }

  const toggleEmployee = (employeeId: number) => {
    setSelectedEmployeeIds(prev =>
      prev.includes(employeeId)
        ? prev.filter(id => id !== employeeId)
        : [...prev, employeeId]
    )
  }

  // Filter out already assigned employees
  const availableEmployees = employees.filter(
    emp => !currentMembers.some(member => member.id === emp.id)
  )

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-3 backdrop-blur-sm">
      <div className="relative w-full max-w-[480px] rounded-2xl bg-white p-6 shadow-xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-lg hover:bg-gray-200"
        >
          ×
        </button>

        <h2 className="mb-4 text-center text-xl font-semibold text-[#073933]">
          Assign Employees to Project
        </h2>

        <div className="mb-4 flex h-32 w-full items-center justify-center overflow-hidden rounded-xl bg-gray-100">
          <Image
            src={supportImg}
            alt="assign employees"
            className="h-full w-auto object-contain"
          />
        </div>

        <p className="mb-5 text-center text-sm text-gray-600">
          Select employees to assign to this project.
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-sm text-gray-500">
              Available Employees
            </label>
            {loading ? (
              <p className="text-center text-sm text-gray-500">Loading employees...</p>
            ) : availableEmployees.length === 0 ? (
              <p className="text-center text-sm text-gray-500">No available employees</p>
            ) : (
              <div className="max-h-48 overflow-y-auto space-y-2">
                {availableEmployees.map((employee) => (
                  <label
                    key={employee.id}
                    className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedEmployeeIds.includes(employee.id)}
                      onChange={() => toggleEmployee(employee.id)}
                      className="rounded border-gray-300 text-[#073933] focus:ring-[#073933]"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-gray-900 truncate">
                        {employee.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {employee.email}
                      </p>
                      {employee.job_title && (
                        <p className="text-xs text-gray-500">
                          {employee.job_title}
                        </p>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={assigning || selectedEmployeeIds.length === 0}
            className="w-full rounded-xl bg-[#073933] py-3 font-medium text-white transition hover:bg-[#0a4a42] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {assigning ? 'Assigning...' : `Assign ${selectedEmployeeIds.length} Employee${selectedEmployeeIds.length !== 1 ? 's' : ''}`}
          </button>
        </form>
      </div>
    </div>
  )
}