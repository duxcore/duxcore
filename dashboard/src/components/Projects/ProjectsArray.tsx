import { Project } from "wrapper";
import React, { useEffect, useState } from "react";
import { useWrapper } from "../../context/WrapperProvider";
import { ProjectBox } from "./ProjectBox";

interface ProjectsArrayProps {}

export const ProjectsArray: React.FC<ProjectsArrayProps> = ({
  children,
}) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const wrapper = useWrapper();

  useEffect(() => {
    wrapper.api.projects.list().then(setProjects);
  }, []);

  return (
    <div>
      {projects.map((project) => (
        <div key={project.id}>
          <h2 className="text-2xl bold py-2">{project.name}</h2>
          <div
            className="grid gap-1"
            style={{ gridTemplateColumns: "repeat(auto-fill, minmax(20rem, 1fr))" }}
          >
            {project.services.map((service) => (
              <>
                <ProjectBox data={service} />
              </>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
