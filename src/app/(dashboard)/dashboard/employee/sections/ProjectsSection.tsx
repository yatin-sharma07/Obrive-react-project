"use client"

import React from "react"
import { motion } from "framer-motion"
import Projects from "../components/Projects"
import { useDashboardData } from "../../useDashboardData"
import SkeletonLoading from "@/components/SkelitonLoading"
import MyProjectsDetailsSection from "./MyProjectsDetailsSection"
import { ProjectItem } from "@/components/dashboard/ProjectCard"
import { AlignJustify, ArrowLeft, Columns, FolderOpen } from "lucide-react"
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

  const sections = [
    {
      id: 1,
      icon: <AlignJustify className="h-4 w-4" />,
      section: "Tasks-list",
      label: "Tasks List",
    },
    {
      id: 2,
      icon: <Columns className="h-4 w-4" />,
      section: "Drag-drop-tasks",
      label: "Board View",
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
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white p-3 shadow-sm">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setSection("")}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition ${
                  section === ""
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <FolderOpen className="h-4 w-4" />
                Project Details
              </button>

              {sections.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSection(s.section)}
                  className={`inline-flex h-11 items-center gap-2 rounded-xl px-4 text-sm font-medium transition ${
                    section === s.section
                      ? "border-2 border-emerald-700 bg-white text-emerald-700"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {s.icon}
                  {s.label}
                </button>
              ))}
            </div>

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
