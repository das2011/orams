/* eslint-disable */
import React from 'react'
import AUpageAlert from '@gov.au/page-alerts/lib/js/react.js'
import { uniqueID } from 'shared/utils/helpers'
import styles from './UserSearchResults.scss'

const renderTable = (props, users) => {
  if (users && users.length > 0) {
    return (
      <article role="main">
        <div className={styles.headingRow}>
          <div className="row">
            <div className="col-md-4 col-sm-4">Name</div>
            <div className="col-md-4 col-sm-4">Role</div>
            <div className="col-md-4 col-sm-4">Email</div>
          </div>
        </div>
        {users.map((user, id = uniqueID()) =>
          <div key={id} className={styles.userRow}>
            <div className="row user">
              <div className="col-md-4 col-sm-4 user-name">
                <span className={styles.name}>
                  <a
                    onClick={() => {
                      props.history.push(`/user-profile/${user.id}`)
                    }}
                  >
                    {user.name}
                  </a>
                </span>
              </div>
              <div className="col-md-4 col-sm-4 user-role">
                {user.role}
              </div>
              <div className="col-md-4 col-sm-4 user-email">
                {user.emailAddress}
              </div>
            </div>
          </div>
        )}
      </article>
    )
  }

  return (
    <AUpageAlert as="info">
      <h4>There were no users found for your search</h4>
    </AUpageAlert>
  )
}

const UserSearchResults = props => {
  const { searchResults } = props
  const users = searchResults || {}

  return (
    <div className={styles.container}>
      {renderTable(props, users)}
    </div>
  )
}

export default UserSearchResults
