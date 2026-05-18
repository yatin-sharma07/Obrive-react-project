"use client"

import React from "react"
import { motion } from "framer-motion"
import Projects from "../components/Projects"
import { useDashboardData } from "../../useDashboardData"
import SkeletonLoading from "@/components/SkelitonLoading"
import MyProjectsDetailsSection from "./MyProjectsDetailsSection"
import { ProjectItem } from "@/components/dashboard/ProjectCard"
import { ArrowLeft, Menu, X } from "lucide-react"
import { Task } from "../../employee/sections/MyProjectTasksSection"

type SelectedProject = ProjectItem & 
{
  tasks?: Task[]
}

const ProjectsSection = () => {
  const [loading] = React.useState(false)
  const [selectedProject, setSelectedProject] = React.useState<SelectedProject | null>(null)
  const [section, setSection] = React.useState<string>("")
  const [isProjectListOpen, setIsProjectListOpen] = React.useState(false)
  const { projects, refetch } = useDashboardData("employee")

  const sectionLabel = section === "" ? "Details" : "Tasks"

  const sections = [
    {
      id: 0,
      iconSrc: "/images/icon1.png",
      iconAlt: "Project details",
      section: "",
    },
    // {
    //   id: 1,
    //   iconSrc: "/images/icon2.png",
    //   iconAlt: "Tasks list",
    //   section: "Tasks-list",
    // },
    // {
    //   id: 2,
    //   iconSrc: "/images/icon3.png",
    //   iconAlt: "Board view",
    //   section: "Drag-drop-tasks",
    // },
  ]

  if (loading) {
    return <SkeletonLoading />
  }

  return (
    <motion.div
      className="h-screen"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
    >
      <div className="mb-3 flex items-center justify-between lg:hidden">
        <button
          type="button"
          onClick={() => setIsProjectListOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm"
        >
          <Menu className="h-4 w-4" />
          Projects
        </button>
        <span className="text-sm font-semibold text-[#1a472a]">{sectionLabel}</span>
      </div>

      {isProjectListOpen ? (
        <button
          type="button"
          aria-label="Close projects list overlay"
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() => setIsProjectListOpen(false)}
        />
      ) : null}

      <div className="flex h-full min-h-0 flex-col gap-4 overflow-hidden lg:flex-row">
        <div className={`${isProjectListOpen ? "translate-x-0" : "-translate-x-full"} fixed inset-y-3 left-3 z-50 w-[min(20rem,calc(100vw-1.5rem))] transition-transform lg:static lg:w-64 lg:translate-x-0 lg:flex-shrink-0`}>
          <div className="h-full overflow-y-auto rounded-2xl bg-white p-3 shadow-sm">
            <div className="mb-3 flex items-center justify-between border-b border-gray-100 pb-3 lg:hidden">
              <h2 className="text-sm font-semibold text-[#1a472a]">Current Projects</h2>
              <button
                type="button"
                onClick={() => setIsProjectListOpen(false)}
                className="rounded-lg p-2 hover:bg-gray-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <Projects
              projects={projects}
              variant="projects"
              setActiveSection={setSection}
              onSelectProject={(project) => {
                setSelectedProject(project)
                setIsProjectListOpen(false)
              }}
            />
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <div className="grid gap-3 rounded-2xl bg-[#eef7ff] p-3 shadow-sm sm:grid-cols-[1fr_auto] lg:grid-cols-[1fr_auto_1fr] lg:items-center">
            <div className="min-w-0">
              <span className="text-sm font-semibold capitalize text-[#1a472a]">
                {sectionLabel}
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {sections.map((s) => (
                <div
                  key={s.id}
                  onClick={() => setSection(s.section)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault()
                      setSection(s.section)
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={s.iconAlt}
                  title={s.iconAlt}
                  style={{ backgroundImage: `url(${s.iconSrc})` }}
                  className={`group inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-2xl border bg-[center] bg-no-repeat transition duration-200 ${
                    section === s.section
                      ? "border-[#1a472a]  bg-[#ffffff] bg-[length:18px_18px] "
                      : "border-[#1a472a] bg-[#ffffff] bg-[length:16px_16px]  hover:-translate-y-1 hover:border-[#1a472a] hover:bg-[#1a472a] hover:bg-[length:20px_20px] hover:shadow-[0_16px_30px_rgba(59,130,246,0.22)]"
                  }`}
                >
                  <span className="sr-only">{s.iconAlt}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-start sm:justify-end">
              {section !== "" ? (
                <button
                  type="button"
                  onClick={() => setSection("")}
                  className="inline-flex items-center gap-2 rounded-xl bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-200"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to details
                </button>
              ) : null}
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-hidden">
            {section === "" && (
              <MyProjectsDetailsSection 
                project={selectedProject} 
                onUpdate={() => refetch()}
              />
            )}
            {/* {section === "Tasks-list" && <MyProjectTasksSection project={selectedProject} />}
            {section === "Drag-drop-tasks" && <TaskDragDrop project={selectedProject} />} */}
          </div>
        </div>
      </div>


    </motion.div>       

  )
}

export default ProjectsSection
