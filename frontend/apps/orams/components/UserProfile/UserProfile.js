/* eslint-disable */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { uniqueID } from 'shared/utils/helpers'
import LoadingIndicatorFullPage from 'shared/LoadingIndicatorFullPage/LoadingIndicatorFullPage'
import styles from './UserProfile.scss'

class UserProfile extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const { userProfileData } = this.props

    return (
      <div>
        {userProfileData
          ? <div>
            <main>
              <div className="row">
                <div className="col-xs-12 col-sm-9">
                  <div className="au-display-xl">
                    User Profile
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-3 col-xs-12">
                  <div className={styles.title}>Name</div>
                </div>
                <div className={styles.badge}>
                  {userProfileData.name}
                </div>
              </div>

              <div className="row">
                <div className="col-sm-3 col-xs-12">
                  <div className={styles.title}>Email</div>
                </div>
                <div className={styles.badge}>
                  {userProfileData.email_address}
                </div>
              </div>

              <div className="row">
                <div className="col-sm-3 col-xs-12">
                  <div className={styles.title}>Account Created At</div>
                </div>
                <div className={styles.badge}>
                  {userProfileData.createdAt}
                </div>
              </div>

              <div className="row">
                <div className="col-sm-3 col-xs-12">
                  <div className={styles.title}>Account Last Login At</div>
                </div>
                <div className={styles.badge}>
                  {userProfileData.loggedInAt}
                </div>
              </div>

            </main>
          </div>
          : <LoadingIndicatorFullPage/>}
      </div>
    )
  }
}

UserProfile.propTypes = {}

const mapStateToProps = state => {
  return {}
}

export default connect(mapStateToProps)(UserProfile)
