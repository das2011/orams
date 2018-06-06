/* eslint-disable */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter, Switch, Route } from 'react-router-dom'
import ReferralDetails from 'orams/components/ReferralDetails/ReferralDetails'
import {
  loadReferralData
} from 'orams/actions/referralActions'

class ReferralReadOnlyPage extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    this.props.loadReferralData(this.props.match.params.id)
  }

  render() {
    const { match } = this.props

    return (
      <Switch>
        <Route exact path={match.url} render={() => <ReferralDetails id={match.params.id} {...this.props} />} />
      </Switch>
    )
  }
}

ReferralReadOnlyPage.propTypes = {
  match: PropTypes.object.isRequired
}

const mapStateToProps = state => {
  return {
    referralDetails: state.referralDetails,
    isLoading: state.app.currentlySending,
    errorMessage: state.app.errorMessage
  };
}

function mapDispatchToProps() {
  return {
    loadReferralData
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps())(ReferralReadOnlyPage))
