'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ProjectItem } from '@/components/dashboard/ProjectCard'
import { AlertCircle, Calendar, CheckCircle, Users } from 'lucide-react'

const formatStatus = (status?: string) => {
  if (!status) return 'Planning'

  return status
    .split(/[_-\s]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
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
      <div className="flex h-full min-h-0 items-center justify-center rounded-2xl bg-white p-6 text-center shadow-sm">
        <p className="text-gray-400">Select a project to view details</p>
      </div>
    )
  }

  const details = project as any

  if (!details) {
    return (
      <div className="flex h-full min-h-0 items-center justify-center rounded-2xl bg-white p-8 shadow-sm">
        <p className="text-gray-400 text-center">Project details not found</p>
      </div>
    )
  }

  const statusText = formatStatus(details.status)
  const statusConfig = getStatusColor(statusText)
  const StatusIcon = statusConfig.icon
  const progress =
    typeof details.progress === 'number'
      ? Math.max(0, Math.min(100, details.progress))
      : typeof details.progress === 'string' && Number.isFinite(Number(details.progress))
        ? Math.max(0, Math.min(100, Number(details.progress)))
        : 0
  const completedTasks = details.completedTasks || 0
  const assignees = details.assignees || []

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
      className="h-full min-h-0 overflow-y-auto rounded-2xl bg-white p-6 shadow-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div className="mb-6" variants={itemVariants} initial="hidden" animate="visible">
        <div className="mb-2 flex items-start justify-between gap-3">
          <div>
            <p className="mb-1 text-xs text-gray-400">{project.code}</p>
            <h2 className="text-2xl font-bold text-[#1a472a]">{project.name}</h2>
          </div>
          <div className={`flex items-center gap-2 rounded-full px-3 py-1 ${statusConfig.bg}`}>
            <StatusIcon className={`h-4 w-4 ${statusConfig.text}`} />
            <span className={`text-sm font-semibold ${statusConfig.text}`}>{statusText}</span>
          </div>
        </div>
        <p className="mt-2 text-sm text-gray-600">{details.description || 'No description available.'}</p>
      </motion.div>

      <motion.div className="mb-6" variants={itemVariants} initial="hidden" animate="visible">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-700">Progress</span>
          <span className="text-sm font-bold text-[#1a472a]">{progress}%</span>
        </div>
        <div className="h-2.5 w-full rounded-full bg-gray-200">
          <motion.div
            className="h-2.5 rounded-full bg-emerald-500 transition-all"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, delay: 0.3 }}
          />
        </div>
      </motion.div>

      <motion.div
        className="mb-6 grid grid-cols-1 gap-4 border-b pb-6 sm:grid-cols-3"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <p className="mb-1 text-xs text-gray-400">Total Tasks</p>
          <p className="text-xl font-bold text-[#1a472a]">{details.allTasks || 0}</p>
          <p className="mt-1 text-xs text-gray-500">{completedTasks} completed</p>
        </motion.div>
        <motion.div variants={itemVariants}>
          <p className="mb-1 text-xs text-gray-400">Active Tasks</p>
          <p className="text-xl font-bold text-[#1a472a]">{details.activeTasks || 0}</p>
        </motion.div>
        <motion.div variants={itemVariants}>
          <p className="mb-1 text-xs text-gray-400">Priority</p>
          <p
            className={`text-sm font-bold ${
              project.priority === 'High'
                ? 'text-red-600'
                : project.priority === 'Medium'
                  ? 'text-amber-600'
                  : 'text-green-600'
            }`}
          >
            {project.priority}
          </p>
        </motion.div>
      </motion.div>

      <motion.div className="mb-6 border-b pb-6" variants={itemVariants} initial="hidden" animate="visible">
        <h3 className="mb-3 text-sm font-semibold text-[#1a472a]">Timeline</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Calendar className="h-4 w-4 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Start Date</p>
              <p className="text-sm text-gray-700">{details.startDate || 'Not set'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="h-4 w-4 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">End Date</p>
              <p className="text-sm text-gray-700">{details.endDate || 'Not set'}</p>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div className="mb-2" variants={itemVariants} initial="hidden" animate="visible">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#1a472a]">
          <Users className="h-4 w-4" />
          Team Members ({assignees.length})
        </h3>
        <motion.div className="space-y-2" variants={containerVariants} initial="hidden" animate="visible">
          {assignees.length > 0 ? (
            assignees.map((member: any) => (
              <motion.div
                key={member.id}
                className="flex items-center justify-between rounded-lg bg-gray-50 p-2"
                variants={itemVariants}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-200 text-xs font-bold text-blue-700">
                    {member.name
                      ?.split(' ')
                      .filter(Boolean)
                      .slice(0, 2)
                      .map((part: string) => part[0]?.toUpperCase())
                      .join('')}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700">{member.name}</p>
                    <p className="text-xs text-gray-500">{member.role || 'Team member'}</p>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <p className="text-sm text-gray-400">No team members available.</p>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export default MyProjectsDetailsSection
