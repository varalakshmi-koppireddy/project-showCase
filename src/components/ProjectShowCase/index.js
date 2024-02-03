import {Component} from 'react'

import Loader from 'react-loader-spinner'

import ProjectItem from '../ProjectItem'

import './index.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProjectShowCase extends Component {
  state = {
    projectsList: [],
    apiStatus: apiStatusConstants.initial,
    selectInput: 'ALL',
  }

  componentDidMount() {
    this.getProjects()
  }

  getProjects = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {selectInput} = this.state
    const url = `https://apis.ccbp.in/ps/projects?category=${selectInput}`
    const options = {
      method: 'GET',
    }

    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()
      const updatedData = data.projects.map(eachItem => ({
        id: eachItem.id,
        name: eachItem.name,
        imageUrl: eachItem.image_url,
      }))

      this.setState({
        projectsList: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onChangeOption = event => {
    this.setState({selectInput: event.target.value}, this.getProjects)
  }

  onRetry = () => {
    this.getProjects()
  }

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#00BFFF" height={50} width={50} />
    </div>
  )

  renderFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
        className="failure-img"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-des">
        We cannot seem to find the page you are looking for
      </p>
      <button type="button" onClick={this.onRetry} className="retry-button">
        Retry
      </button>
    </div>
  )

  renderSuccessView = () => {
    const {projectsList} = this.state

    return (
      <ul className="list-container">
        {projectsList.map(eachItem => (
          <ProjectItem key={eachItem.id} projectDetails={eachItem} />
        ))}
      </ul>
    )
  }

  renderProjectsList = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    const {selectInput} = this.state

    return (
      <div className="bg-container">
        <nav className="nav-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            alt="website logo"
            className="logo-image"
          />
        </nav>
        <select
          className="select-input"
          value={selectInput}
          onChange={this.onChangeOption}
        >
          {categoriesList.map(eachOption => (
            <option value={eachOption.id} key={eachOption.id}>
              {eachOption.displayText}
            </option>
          ))}
        </select>
        {this.renderProjectsList()}
      </div>
    )
  }
}

export default ProjectShowCase
