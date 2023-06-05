import {Component} from 'react'

import Loader from 'react-loader-spinner'

import Header from '../Header'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inprogress: 'IN_PROGRESS',
}

class CourseItemDetails extends Component {
  state = {apiStatus: apiStatusConstants.initial, courseData: []}

  componentDidMount() {
    this.getCourseItemDetails()
  }

  getCourseItemDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inprogress})
    const {match} = this.props
    const {params} = match
    const {id} = params

    const url = `https://apis.ccbp.in/te/courses/${id}`
    const options = {
      method: 'GET',
    }
    const response = await fetch(url, options)

    if (response.ok === true) {
      const data = await response.json()
      const updatedData = {
        id: data.course_details.id,
        imageUrl: data.course_details.image_url,
        description: data.course_details.description,
        name: data.course_details.name,
      }
      this.setState({
        courseData: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderCourseDetails = () => {
    const {courseData} = this.state
    const {name, imageUrl, description} = courseData

    return (
      <>
        <Header />
        <div className="course-item-container">
          <div className="course-item">
            <img src={imageUrl} alt={name} className="course-item-image" />
            <div className="course-item-name-content-container ">
              <h1 className="course-item-name">{name}</h1>
              <p className="course-item-content">{description}</p>
            </div>
          </div>
        </div>
      </>
    )
  }

  onClickRetry = () => {
    this.getCourseItemDetails()
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
          onClick={this.onClickRetry}
        >
          Retry
        </button>
      </div>
    </>
  )

  renderLoadingView = () => (
    <div className="loader" data-testid="loader">
      <Loader type="ThreeDots" color="#4656a1" />
    </div>
  )

  renderApiStatus = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderCourseDetails()

      case apiStatusConstants.failure:
        return this.renderFailureView()

      case apiStatusConstants.inprogress:
        return this.renderLoadingView()

      default:
        return null
    }
  }

  render() {
    return <div>{this.renderApiStatus()}</div>
  }
}

export default CourseItemDetails
