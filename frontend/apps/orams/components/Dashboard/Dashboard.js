import React, { Component } from 'react'
import Alert from '@gov.au/page-alerts/lib/js/react.js'

export default class Dashboard extends Component {
  renderMessageBanner() {
    const { errorMessage, successMessage } = this.props
    if (successMessage)
      return (
        <Alert as="success">
          {successMessage}
        </Alert>
      )

    if (errorMessage) {
      return (
        <Alert as="error">
          {errorMessage}
        </Alert>
      )
    }

    return null
  }

  render() {
    return (
      <main>
        {this.renderMessageBanner()}
        <div>DASHBOARD</div>
      </main>
    )
  }
}
