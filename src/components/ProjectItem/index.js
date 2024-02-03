import './index.css'

const ProjectItem = props => {
  const {projectDetails} = props
  const {name, imageUrl} = projectDetails

  return (
    <li className="project-item">
      <img src={imageUrl} alt={name} className="project-img" />
      <p className="heading">{name}</p>
    </li>
  )
}

export default ProjectItem
