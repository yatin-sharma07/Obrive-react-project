'use client'

import { useEffect, useState } from 'react'

interface Employee {
  id: number
  name: string
  email: string
  role: string
  status: string
}

export default function HRDashboard() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)


  return (
    <div className="space-y-6">
        <div className='side touch-pan-left'></div>

        <div className='dashboard-area'></div>

        <div className='right-panel'> </div>


    </div>
  )
}