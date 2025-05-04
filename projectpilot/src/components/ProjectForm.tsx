import PropTypes from 'prop-types';
import { Project } from "./Projects";
import { ChangeEvent, SyntheticEvent, useState } from 'react';

interface ProjectFormProps {
  project: Project;
  onCancel: () => void;
  onSave: (project: Project) => void;
}

interface ValidationErrors {
  name: string;
  description: string;
  budget: string;
}

function ProjectForm({ project: initialProject, onSave, onCancel }: ProjectFormProps) {
  const [project, setProject] = useState(initialProject);
  const [errors, setErrors] = useState<ValidationErrors>({
    name: '',
    description: '',
    budget: ''
  });

  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault();
    if (!isValid()) return;
    onSave(project);
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, type } = event.target;
    const target = event.target as HTMLInputElement;

    let value: string | number | boolean;
    if (type === 'checkbox') {
      value = target.checked;
    } else if (type === 'number') {
      value = Number(target.value);
    } else {
      value = target.value;
    }

    setProject((p) => {
      const updatedProject = new Project({
        ...p,
        [name]: value
      });
      setErrors(validate(updatedProject));
      return updatedProject;
    });
  };

  function validate(project: Project): ValidationErrors {
    const errors: ValidationErrors = {name: '', description: '', budget: ''};
    if (project.name.length === 0) {
      errors.name = 'Name is required';
    } else if (project.name.length < 3) {
      errors.name = 'Name needs to be at least 3 characters.';
    }
    if (project.description.length === 0) {
      errors.description = 'Description is required';
    }
    if (project.budget <= 0) {
      errors.budget = 'Budget must be more than $0';
    }
    return errors;
  }

  function isValid(): boolean {
    return (
      errors.name.length === 0 &&
      errors.description.length === 0 &&
      errors.budget.length === 0
    );
  }

  return (
    <form className="input-group vertical" onSubmit={handleSubmit}>
      <label htmlFor="name">Project Name</label>
      <input
        type="text"
        name="name"
        placeholder="enter name"
        value={project.name}
        onChange={handleChange}
      />
      {errors.name.length > 0 && (
        <div className="card error">
          <p>{errors.name}</p>
        </div>
      )}
      <label htmlFor="description">Project Description</label>
      <textarea
        name="description"
        placeholder="enter description"
        value={project.description}
        onChange={handleChange}
      />
      {errors.description.length > 0 && (
        <div className="card error">
          <p>{errors.description}</p>
        </div>
      )}
      <label htmlFor="budget">Project Budget</label>
      <input
        type="number"
        name="budget"
        placeholder="enter budget"
        value={project.budget}
        onChange={handleChange}
      />
      {errors.budget.length > 0 && (
        <div className="card error">
          <p>{errors.budget}</p>
        </div>
      )}
      <label htmlFor="isActive">Active?</label>
      <input
        type="checkbox"
        name="isActive"
        checked={project.isActive}
        onChange={handleChange}
      />
      <div className="input-group">
        <button type="submit" className="primary bordered medium">Save</button>
        <span />
        <button 
          type="button" 
          className="bordered medium"
          onClick={onCancel}
        >
          cancel
        </button>
      </div>
    </form>
  );
}

ProjectForm.propTypes = {
  project: PropTypes.instanceOf(Project).isRequired,
  onCancel: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired
};

export default ProjectForm;