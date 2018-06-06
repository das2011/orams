/* eslint-disable */
import React, { Component } from 'react'
import format from 'date-fns/format'
import parse from 'date-fns/parse'
import AUpageAlert from '@gov.au/page-alerts/lib/js/react.js'
import LoadingIndicatorFullPage from 'shared/LoadingIndicatorFullPage/LoadingIndicatorFullPage'
import styles from './UserProfile.scss'

class UserProfile extends Component {

  constructor(props) {
    super(props)
    this.state = {}
  }

  formatDate(date, dateFormat = 'D MMM YYYY') {
    if (date) {
      const parsed = parse(date)
      return format(parsed, dateFormat)
    }

    return ''
  }

  formatLockStatus(locked) {
    return locked ? 'Y' : 'N'
  }

  handleActivateUser(userProfileData) {
    const { id } = userProfileData
    const { activateUser } = this.props

    activateUser(id)
  }

  handleDeactivateUser(userProfileData) {
    const { id } = userProfileData
    const { deactivateUser } = this.props

    deactivateUser(id)
  }

  handleUnlockUser(userProfileData) {
    const { id } = userProfileData
    const { unlockUser } = this.props

    unlockUser(id)
  }

  renderActivateDeactivate(userProfileData) {
    if (userProfileData.active) {
      return (
        <div className={styles.statusAction}>
          <button className="au-btn" onClick={() => {this.handleDeactivateUser(userProfileData)}}>
            Deactivate
          </button>
        </div>
      )
    }

    return (
      <div className={styles.statusAction}>
        <button className="au-btn" onClick={() => {this.handleActivateUser(userProfileData)}}>
          Activate
        </button>
      </div>
    )
  }

  renderUnlockButton(userProfileData) {
    if (userProfileData.locked) {
      return (
        <div className={styles.statusAction}>
          <button className="au-btn" onClick={() => {this.handleUnlockUser(userProfileData)}}>
            Unlock
          </button>
        </div>
      )
    }
  }

  renderChangeStatus(userProfileData) {
    return (
      <div>
        {this.renderActivateDeactivate(userProfileData)}
        {this.renderUnlockButton(userProfileData)}
      </div>
    )
  }

  renderGeneralError() {
    const { errorMessage } = this.props

    if ( errorMessage) {
      return (
        <AUpageAlert as="error">
          <h4>{errorMessage}</h4>
        </AUpageAlert>
      )
    }
  }

  renderUpdateMessages() {
    const { updateUserSuccessMessage, updateUserErrorMessage } = this.props

    if ( updateUserSuccessMessage ) {
      return (
        <AUpageAlert as="success">
          <h4>{updateUserSuccessMessage}</h4>
        </AUpageAlert>
      )
    }

    if ( updateUserErrorMessage) {
      return (
        <AUpageAlert as="error">
          <h4>{updateUserErrorMessage}</h4>
        </AUpageAlert>
      )
    }
  }

  render() {
    const { userProfileData } = this.props
    const dateTimeFormat = 'D MMMM YYYY HH:mm'

    return (
      <div className={styles.container}>
        {this.renderGeneralError()}
        {userProfileData
          ? <article role="main">
              <div className={styles.headerSection}>
                <div className="row">
                  <div className="col-xs-12 col-sm-9">
                    <div className="au-display-xl">
                      {userProfileData.emailAddress}
                    </div>
                  </div>
                </div>
              </div>
              {this.renderUpdateMessages()}
              <div>
                <a
                  onClick={() => {
                    this.props.history.goBack()
                  }}
                >
                  Back To User Search
                </a>
              </div>
              <div className={styles.headingRow}>
                <div className="row">
                  <div className="col-md-2 col-sm-2">Name</div>
                  <div className="col-md-1 col-sm-1">Role</div>
                  <div className="col-md-2 col-sm-2">Supplier</div>
                  <div className="col-md-2 col-sm-2">Last login</div>
                  <div className="col-md-2 col-sm-2">Last password change</div>
                  <div className="col-md-1 col-sm-1">Locked</div>
                  <div className="col-md-2 col-sm-2">Change status</div>
                </div>
              </div>
              <div className={styles.userRow}>
                <div className="row">
                  <div className="col-md-2 col-sm-2">
                    {userProfileData.name}
                  </div>
                  <div className="col-md-1 col-sm-1">
                    {userProfileData.role}
                  </div>
                  <div className="col-md-2 col-sm-2">
                    {userProfileData.supplier || ''}
                  </div>
                  <div className="col-md-2 col-sm-2">
                    {this.formatDate(userProfileData.loggedInAt)}
                  </div>
                  <div className="col-md-2 col-sm-2">
                    {this.formatDate(userProfileData.passwordChangedAt, dateTimeFormat)}
                  </div>
                  <div className="col-md-1 col-sm-1">
                    {this.formatLockStatus(userProfileData.locked)}
                  </div>
                  <div className="col-md-2 col-sm-2">
                    {this.renderChangeStatus(userProfileData)}
                  </div>
                </div>
              </div>

            </article>
          : <LoadingIndicatorFullPage/>}
      </div>
    )
  }
}

export default UserProfile
