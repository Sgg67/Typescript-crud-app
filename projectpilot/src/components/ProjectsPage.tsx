import ProjectList from './ProjectList';
import { Project } from './Projects';
import { useState, useEffect } from 'react';
import { projectAPI } from './projectAPI';

// Helper functions for localStorage
const getLocalProjects = (): Project[] => {
  const saved = localStorage.getItem('projects');
  return saved ? JSON.parse(saved) : [];
};

const setLocalProjects = (projects: Project[]) => {
  localStorage.setItem('projects', JSON.stringify(projects));
};

const ProjectsPage = () => {
  const [projects, setProjects] = useState<Project[]>(getLocalProjects());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    async function loadProjects() {
      setLoading(true);
      try {
        const data = await projectAPI.get(currentPage);
        setError(undefined);
        setProjects((prevProjects) => {
          const newProjects = currentPage === 1 ? data : [...prevProjects, ...data];
          setLocalProjects(newProjects);
          return newProjects;
        });
      } catch (e) {
        if (e instanceof Error) setError(e.message);
      } finally {
        setLoading(false);
      }
    }

    // Fetch only if there are no local projects
    if (projects.length === 0) {
      loadProjects();
    }
  }, [currentPage, projects.length]);

  const saveProject = (project: Project) => {
    projectAPI
      .put(project)
      .then((updatedProject) => {
        setProjects((prevProjects) => {
          const updatedProjects = prevProjects.map((p) =>
            p.id === project.id ? updatedProject : p
          );
          setLocalProjects(updatedProjects);
          return updatedProjects;
        });
      })
      .catch((e) => {
        if (e instanceof Error) setError(e.message);
      });
  };

  return (
    <div>
      {loading && <p>Loading projects...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ProjectList projects={projects} onSave={saveProject} />
    </div>
  );
};

export default ProjectsPage;
