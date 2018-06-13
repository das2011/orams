import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter, Switch, Route } from 'react-router-dom'
import Dashboard from 'orams/components/Dashboard/Dashboard'

export class DashboardPage extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const { match } = this.props

    return (
      <Switch>
        <Route exact path={match.url} render={() => <Dashboard {...this.props} />} />
      </Switch>
    )
  }
}

DashboardPage.propTypes = {
  match: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  errorMessage: state.app.errorMessage,
  successMessage: state.app.successMessage
})

export default withRouter(connect(mapStateToProps)(DashboardPage))
