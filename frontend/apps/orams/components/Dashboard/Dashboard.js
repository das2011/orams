import React, { Component } from 'react'
import Alert from '@gov.au/page-alerts/lib/js/react.js'

export default class Dashboard extends Component {
  render() {
    return (
      <main>
        <Alert as="success">Successfully accepted referral</Alert>
        <div>DASHBOARD</div>
      </main>
    )
  }
}
