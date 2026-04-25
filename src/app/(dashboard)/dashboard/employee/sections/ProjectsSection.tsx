"use client"
import React from 'react'
import {motion} from "framer-motion"
import Projects from '../components/Projects'
import { useDashboardData } from '../../useDashboardData'
import SkeletonLoading from '@/components/SkelitonLoading'
import MyProjectsDetailsSection from './MyProjectsDetailsSection'
import { ProjectItem } from '@/components/dashboard/ProjectCard'
import {AlignJustify, Columns, SlidersHorizontal} from 'lucide-react'

const ProjectsSection = () => {
  const[loading, setLoading]=React.useState(false)
  const [selectedProject, setSelectedProject] = React.useState<ProjectItem | null>(null)
  const [section, setSection] = React.useState<string>("");
  const {projects}=useDashboardData('employee')

  const sections =[{
    id:1,
    icon:<AlignJustify/>,
    section:"Tasks-list"
  },{
    id:2,
    icon:<Columns/>,
    section:"Drag-drop-tasks"
  }]
  
  if(loading){
    return(
      <SkeletonLoading/>
    )
  }
  
  return (
   <>
  <motion.div className=' pr-3'
  initial={{opacity:0,y:20}}
  animate={{opacity:1,y:0}}
transition={{duration:0.7}}>
     <div className='flex gap-3'>
     <div className=" flex flex-col justify-center h-screen">
      <div className="bg-white h-[600px] w-60 rounded-lg">
  <Projects projects={projects} variant="projects" onSelectProject={setSelectedProject}/>
      </div>
    </div>
    <div className='flex flex-col justify-center ites-center'>
    <div className='flex justify-center gap-2'>
  {sections.map((s) => (
    <div
      key={s.id}
      onClick={() => setSection(s.section)} // ✅ FIX
      className={`
        w-12 h-12 flex items-center justify-center rounded-xl cursor-pointer transition
        ${
          section === s.section
            ? "border-2 border-emerald-700 text-emerald-700 bg-white"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        }
      `}
    >
      {s.icon}
    </div>
  ))}
</div>
      <MyProjectsDetailsSection project={selectedProject}/>
    </div>
   </div>
  </motion.div>
    
    </>
  )
}

export default ProjectsSection