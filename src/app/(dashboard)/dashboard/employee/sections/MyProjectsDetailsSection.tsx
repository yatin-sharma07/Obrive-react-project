'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ProjectItem } from '@/components/dashboard/ProjectCard'
import { Calendar, Users, CheckCircle, AlertCircle, BarChart3 } from 'lucide-react'

// Extended project details with more information
const PROJECT_DETAILS: Record<string, any> = {
  'PROJ-001': {
    id: '1',
    code: 'PROJ-001',
    name: 'Website Redesign',
    description: 'Complete overhaul of the company website with modern design and improved UX',
    priority: 'High',
    status: 'In Progress',
    progress: 65,
    startDate: 'Jan 15, 2025',
    endDate: 'May 30, 2025',
    allTasks: 24,
    completedTasks: 16,
    activeTasks: 8,
    assignees: [
      { id: '1', name: 'John Doe', role: 'Lead Developer', avatar: 'JD' },
      { id: '2', name: 'Jane Smith', role: 'UI Designer', avatar: 'JS' },
      { id: '7', name: 'Emily Chen', role: 'QA Engineer', avatar: 'EC' },
    ],
    team: [
      { name: 'Frontend Team', members: 5 },
      { name: 'Backend Team', members: 3 },
      { name: 'Design Team', members: 2 },
    ],
  },
  'PROJ-002': {
    id: '2',
    code: 'PROJ-002',
    name: 'Mobile App Development',
    description: 'Native iOS and Android app for customer engagement',
    priority: 'Medium',
    status: 'In Progress',
    progress: 45,
    startDate: 'Feb 3, 2025',
    endDate: 'Aug 15, 2025',
    allTasks: 18,
    completedTasks: 8,
    activeTasks: 5,
    assignees: [
      { id: '3', name: 'Alex Johnson', role: 'Mobile Lead', avatar: 'AJ' },
      { id: '8', name: 'David Lee', role: 'iOS Dev', avatar: 'DL' },
    ],
    team: [
      { name: 'iOS Team', members: 2 },
      { name: 'Android Team', members: 2 },
    ],
  },
  'PROJ-003': {
    id: '3',
    code: 'PROJ-003',
    name: 'Database Optimization',
    description: 'Optimize database queries and improve system performance',
    priority: 'Medium',
    status: 'Planning',
    progress: 20,
    startDate: 'Mar 10, 2025',
    endDate: 'Jun 10, 2025',
    allTasks: 12,
    completedTasks: 2,
    activeTasks: 3,
    assignees: [
      { id: '4', name: 'Sarah Wilson', role: 'DBA', avatar: 'SW' },
      { id: '5', name: 'Mike Brown', role: 'Backend Dev', avatar: 'MB' },
    ],
    team: [
      { name: 'Database Team', members: 3 },
    ],
  },
  'PROJ-004': {
    id: '4',
    code: 'PROJ-004',
    name: 'API Integration',
    description: 'Integrate third-party payment and analytics APIs',
    priority: 'Low',
    status: 'Completed',
    progress: 100,
    startDate: 'Mar 22, 2025',
    endDate: 'Apr 22, 2025',
    allTasks: 8,
    completedTasks: 8,
    activeTasks: 0,
    assignees: [
      { id: '6', name: 'Tom Harris', role: 'API Developer', avatar: 'TH' },
    ],
    team: [
      { name: 'Integration Team', members: 2 },
    ],
  },
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Completed':
      return { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle }
    case 'In Progress':
      return { bg: 'bg-blue-100', text: 'text-blue-700', icon: AlertCircle }
    case 'Planning':
      return { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: AlertCircle }
    default:
      return { bg: 'bg-gray-100', text: 'text-gray-700', icon: AlertCircle }
  }
}

const MyProjectsDetailsSection = ({ project }: { project: ProjectItem | null }) => {
  if (!project) {
    return (
      <div className="bg-white rounded-lg  w-screen h-screen flex justify-center text-center items-center">
        <p className="text-gray-400 text-center items-center">Select a project to view details</p>
      </div>
    )
  }

  // Get detailed project data from the dummy data
  const details = PROJECT_DETAILS[project.code]

  if (!details) {
    return (
      <div className="bg-white rounded-lg p-8 w-screen h-screen flex items-center justify-center">
        <p className="text-gray-400 text-center">Project details not found</p>
      </div>
    )
  }

  const statusConfig = getStatusColor(details.status)
  const StatusIcon = statusConfig.icon

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  }

  return (
    <motion.div
      className="bg-white rounded-lg p-6 h-screen overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <motion.div className="mb-6" variants={itemVariants} initial="hidden" animate="visible">
        <div className="flex items-start justify-between mb-2">
          <div>
            <p className="text-xs text-gray-400 mb-1">{project.code}</p>
            <h2 className="text-2xl font-bold text-[#1a472a]">{project.name}</h2>
          </div>
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${statusConfig.bg}`}>
            <StatusIcon className={`w-4 h-4 ${statusConfig.text}`} />
            <span className={`text-sm font-semibold ${statusConfig.text}`}>{details.status}</span>
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-2">{details.description}</p>
      </motion.div>

      {/* Progress Bar */}
      <motion.div className="mb-6" variants={itemVariants} initial="hidden" animate="visible">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold text-gray-700">Progress</span>
          <span className="text-sm font-bold text-[#1a472a]">{details.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <motion.div
            className="bg-emerald-500 h-2.5 rounded-full transition-all"
            initial={{ width: 0 }}
            animate={{ width: `${details.progress}%` }}
            transition={{ duration: 1, delay: 0.3 }}
          />
        </div>
      </motion.div>

      {/* Key Metrics */}
      <motion.div className="grid grid-cols-3 gap-4 mb-6 pb-6 border-b" variants={containerVariants} initial="hidden" animate="visible">
        <motion.div variants={itemVariants}>
          <p className="text-xs text-gray-400 mb-1">Total Tasks</p>
          <p className="text-xl font-bold text-[#1a472a]">{details.allTasks}</p>
          <p className="text-xs text-gray-500 mt-1">{details.completedTasks} completed</p>
        </motion.div>
        <motion.div variants={itemVariants}>
          <p className="text-xs text-gray-400 mb-1">Active Tasks</p>
          <p className="text-xl font-bold text-[#1a472a]">{details.activeTasks}</p>
        </motion.div>
        <motion.div variants={itemVariants}>
          <p className="text-xs text-gray-400 mb-1">Priority</p>
          <p className={`text-sm font-bold ${
            project.priority === 'High' ? 'text-red-600' :
            project.priority === 'Medium' ? 'text-amber-600' :
            'text-green-600'
          }`}>
            {project.priority}
          </p>
        </motion.div>
      </motion.div>

      {/* Timeline */}
      <motion.div className="mb-6 pb-6 border-b" variants={itemVariants} initial="hidden" animate="visible">
        <h3 className="text-sm font-semibold text-[#1a472a] mb-3">Timeline</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Calendar className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Start Date</p>
              <p className="text-sm text-gray-700">{details.startDate}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">End Date</p>
              <p className="text-sm text-gray-700">{details.endDate}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Team Members */}
      <motion.div className="mb-6" variants={itemVariants} initial="hidden" animate="visible">
        <h3 className="text-sm font-semibold text-[#1a472a] mb-3 flex items-center gap-2">
          <Users className="w-4 h-4" />
          Team Members ({details.assignees.length})
        </h3>
        <motion.div className="space-y-2" variants={containerVariants} initial="hidden" animate="visible">
          {details.assignees.map((member: any) => (
            <motion.div
              key={member.id}
              className="flex items-center justify-between p-2 bg-gray-50 rounded"
              variants={itemVariants}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center text-xs font-bold text-blue-700">
                  {member.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700">{member.name}</p>
                  <p className="text-xs text-gray-500">{member.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export default MyProjectsDetailsSection