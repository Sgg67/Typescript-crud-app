import { Project } from './Projects';
import {useState} from 'react';
import PropTypes from 'prop-types';
import ProjectCard from './ProjectCard';
import ProjectForm from './ProjectForm';

interface ProjectListProps {
  projects: Project[];
  onSave: (project: Project) => void;
}

function ProjectList({ projects, onSave }: ProjectListProps) {
  const [projectBeingEdited, setProjectBeingEdited] = useState<Project | null>(null);
  const handleEdit = (project: Project) => {  
    setProjectBeingEdited(project);
  };

  const cancelEditing = () => {
    setProjectBeingEdited(null);
  }
  
  const items = projects.map((project) => (
    <div key={project.id} className="cols-sm">
      {project === projectBeingEdited ? (
        <ProjectForm 
        project = {project}
        onCancel = {cancelEditing}
        onSave = {onSave}
        />
      ) : (
        <ProjectCard project = {project} onEdit = {handleEdit}/>
      )}
    </div>
  ));
  
  return <div className="row">{items}</div>;
}

// For PropTypes, you need to provide the correct shape since Project is likely an interface
ProjectList.propTypes = {
  projects: PropTypes.arrayOf(PropTypes.instanceOf(Project)).isRequired,
  onSave: PropTypes.func.isRequired
};

export default ProjectList;