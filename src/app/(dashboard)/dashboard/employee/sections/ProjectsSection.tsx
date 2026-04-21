import React from 'react'
import Projects from '../components/Projects'
import { useDashboardData } from '../../useDashboardData'
import SkeletonLoading from '@/components/SkelitonLoading'

const ProjectsSection = () => {
  const[loading, setLoading]=React.useState(false)
  const {projects}=useDashboardData('employee')
  if(loading){
    return(
      <SkeletonLoading/>
    )
  }
  return (
    <div className="flex">
      <div className="bg-white h-[600px] w-60 rounded-lg">
  <Projects projects={projects} variant="projects"/>
      </div>
    </div>
  )
}

export default ProjectsSection