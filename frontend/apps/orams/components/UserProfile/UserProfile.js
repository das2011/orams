import React, { Component } from 'react'
import AUpageAlert from '@gov.au/page-alerts/lib/js/react.js'
import LoadingIndicatorFullPage from 'shared/LoadingIndicatorFullPage/LoadingIndicatorFullPage'
import { DATE_FORMAT_D_MMM_YYYY, DATE_TIME_FORMAT_D_MMM_YYYY_HHMM } from 'orams/constants/formatConstants'
import { formatDate } from 'orams/util/dateUtil'
import styles from './UserProfile.scss'

const formatLockStatus = locked => (locked ? 'Y' : 'N')
const renderColumn = (size, text) => {
  const displayText = text || ''

  return (
    <div className={`col-md-${size} col-sm-${size}`}>
      {displayText}
    </div>
  )
}

class UserProfile extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  handleActivateUser(userId) {
    const { activateUser } = this.props

    activateUser(userId)
  }

  handleDeactivateUser(userId) {
    const { deactivateUser } = this.props

    deactivateUser(userId)
  }

  handleUnlockUser(userId) {
    const { unlockUser } = this.props

    unlockUser(userId)
  }

  renderActivateDeactivate(userProfileData) {
    const { id, active } = userProfileData

    if (active) {
      return (
        <div className={styles.statusAction}>
          <button
            className="au-btn"
            onClick={() => {
              this.handleDeactivateUser(id)
            }}
          >
            Deactivate
          </button>
        </div>
      )
    }

    return (
      <div className={styles.statusAction}>
        <button
          className="au-btn"
          onClick={() => {
            this.handleActivateUser(id)
          }}
        >
          Activate
        </button>
      </div>
    )
  }

  renderUnlockButton(userProfileData) {
    const { id, locked } = userProfileData

    if (locked) {
      return (
        <div className={styles.statusAction}>
          <button
            className="au-btn"
            onClick={() => {
              this.handleUnlockUser(id)
            }}
          >
            Unlock
          </button>
        </div>
      )
    }

    return ''
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

    if (errorMessage) {
      return (
        <AUpageAlert as="error">
          <h4>{`${errorMessage}`}</h4>
        </AUpageAlert>
      )
    }

    return ''
  }

  renderUpdateMessages() {
    const { updateUserSuccessMessage, updateUserErrorMessage } = this.props

    if (updateUserSuccessMessage) {
      return (
        <AUpageAlert as="success">
          <h4>{`${updateUserSuccessMessage}`}</h4>
        </AUpageAlert>
      )
    }

    if (updateUserErrorMessage) {
      return (
        <AUpageAlert as="error">
          <h4>{`${updateUserErrorMessage}`}</h4>
        </AUpageAlert>
      )
    }

    return ''
  }

  renderUserTable() {
    const { userProfileData } = this.props

    if (userProfileData) {
      const { name, role, supplier, loggedInAt, passwordChangedAt, locked } = userProfileData
      const loggedInDate = formatDate(loggedInAt, DATE_FORMAT_D_MMM_YYYY)
      const passwordChangedDateTime = formatDate(passwordChangedAt, DATE_TIME_FORMAT_D_MMM_YYYY_HHMM)

      return (
        <article role="main">
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
              {renderColumn(2, 'Name')}
              {renderColumn(1, 'Role')}
              {renderColumn(2, 'Supplier')}
              {renderColumn(2, 'Last login')}
              {renderColumn(2, 'Last password')}
              {renderColumn(1, 'Locked')}
              {renderColumn(2, 'Change status')}
            </div>
          </div>
          <div className={styles.userRow}>
            <div className="row">
              {renderColumn(2, name)}
              {renderColumn(1, role)}
              {renderColumn(2, supplier)}
              {renderColumn(2, loggedInDate)}
              {renderColumn(2, passwordChangedDateTime)}
              {renderColumn(1, formatLockStatus(locked))}
              <div className="col-md-2 col-sm-2">
                {this.renderChangeStatus(userProfileData)}
              </div>
            </div>
          </div>
        </article>
      )
    }

    return <LoadingIndicatorFullPage />
  }

  render() {
    return (
      <div className={styles.container}>
        {this.renderGeneralError()}
        {this.renderUserTable()}
      </div>
    )
  }
}

export default UserProfile
