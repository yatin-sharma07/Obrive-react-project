"use client"

import React from "react"
import { motion } from "framer-motion"
import Projects from "../components/Projects"
import { useDashboardData } from "../../useDashboardData"
import SkeletonLoading from "@/components/SkelitonLoading"
import MyProjectsDetailsSection from "./MyProjectsDetailsSection"
import { ProjectItem } from "@/components/dashboard/ProjectCard"
import { ArrowLeft } from "lucide-react"
import MyProjectTasksSection, { type Task } from "./MyProjectTasksSection"
import TaskDragDrop from "./TaskDragDrop"

type SelectedProject = ProjectItem & {
  tasks?: Task[]
}

const ProjectsSection = () => {
  const [loading] = React.useState(false)
  const [selectedProject, setSelectedProject] = React.useState<SelectedProject | null>(null)
  const [section, setSection] = React.useState<string>("")
  const { projects } = useDashboardData("employee")

  const sectionLabel = section === "" ? "Details" : "Tasks"

  const sections = [
    {
      id: 0,
      iconSrc: "/images/icon1.png",
      iconAlt: "Project details",
      section: "",
    },
    {
      id: 1,
      iconSrc: "/images/icon2.png",
      iconAlt: "Tasks list",
      section: "Tasks-list",
    },
    {
      id: 2,
      iconSrc: "/images/icon3.png",
      iconAlt: "Board view",
      section: "Drag-drop-tasks",
    },
  ]

  if (loading) {
    return <SkeletonLoading />
  }

  return (
    <motion.div
      className="h-screen p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
    >
      <div className="flex h-full gap-4 overflow-hidden">
        <div className="h-full w-64 flex-shrink-0">
          <div className="h-full overflow-y-auto rounded-2xl bg-white p-3 shadow-sm">
            <Projects
              projects={projects}
              variant="projects"
              onSelectProject={setSelectedProject}
            />
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 rounded-2xl bg-[#eef7ff] p-3 shadow-sm">
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
                      ? "border-blue-600  bg-[#ffffff] bg-[length:18px_18px] "
                      : "border-[#c9def4] bg-[#ffffff] bg-[length:16px_16px]  hover:-translate-y-1 hover:border-[#9fc5eb] hover:bg-[#e9f4ff] hover:bg-[length:20px_20px] hover:shadow-[0_16px_30px_rgba(59,130,246,0.22)]"
                  }`}
                >
                  <span className="sr-only">{s.iconAlt}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-end">
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

          <div className="min-h-0 flex-1">
            {section === "" && <MyProjectsDetailsSection project={selectedProject} />}
            {section === "Tasks-list" && <MyProjectTasksSection project={selectedProject} />}
            {section === "Drag-drop-tasks" && <TaskDragDrop project={selectedProject} />}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default ProjectsSection
