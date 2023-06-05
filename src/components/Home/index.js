import {Component} from 'react'

import {Link} from 'react-router-dom'

import Loader from 'react-loader-spinner'

import Header from '../Header'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inprogress: 'IN_PROGRESS',
}

class Home extends Component {
  state = {coursesList: [], apiStatus: apiStatusConstants.initial}

  componentDidMount() {
    this.getCourseDetails()
  }

  getCourseDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inprogress})

    const url = 'https://apis.ccbp.in/te/courses'
    const options = {
      method: 'GET',
      body: JSON.stringify(),
    }
    const response = await fetch(url, options)
    console.log(response)
    if (response.ok === true) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.courses.map(eachCourse => ({
        id: eachCourse.id,
        logoUrl: eachCourse.logo_url,
        name: eachCourse.name,
      }))
      this.setState({
        coursesList: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onClickRetryButton = () => {
    this.getCourseDetails()
  }

  renderFailureView = () => (
    <>
      <Header />
      <div className="course-failure-view-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/tech-era/failure-img.png"
          alt="failure view"
          className="course-failure-view-image"
        />
        <h1 className="course-failure-heading-text">
          Oops! Something Went Wrong
        </h1>
        <p className="course-failure-description">
          We cannot seem to find the page you are looking for.
        </p>
        <button
          type="button"
          className="course-retry-button"
          onClick={this.onClickRetryButton}
        >
          Retry
        </button>
      </div>
    </>
  )

  renderCourseListView = () => {
    const {coursesList} = this.state

    return (
      <>
        <Header />
        <div className="home-route-container">
          <h1 className="heading">Courses</h1>
          <ul className="courses-list">
            {coursesList.map(eachItem => {
              const {name, logoUrl, id} = eachItem

              return (
                <Link to={`/courses/${id}`} key={id} className="nav-link">
                  <li className="item-container">
                    <img src={logoUrl} alt={name} className="image" />
                    <p className="course-title">{name}</p>
                  </li>
                </Link>
              )
            })}
          </ul>
        </div>
      </>
    )
  }

  renderLoadingView = () => (
    <div className="loader" data-testid="loader">
      <Loader type="ThreeDots" color="#4656a1" />
    </div>
  )

  renderApiStatus = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderCourseListView()

      case apiStatusConstants.failure:
        return this.renderFailureView()

      case apiStatusConstants.inprogress:
        return this.renderLoadingView()

      default:
        return null
    }
  }

  render() {
    return <div className="app-container">{this.renderApiStatus()}</div>
  }
}

export default Home
