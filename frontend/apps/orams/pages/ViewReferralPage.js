import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter, Switch, Route } from 'react-router-dom'
import ReferralDetails from 'orams/components/ReferralDetails/ReferralDetails'
import { loadReferralData, acceptReferral } from 'orams/actions/referralActions'

export class ViewReferralPage extends Component {
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

ViewReferralPage.propTypes = {
  match: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  referralDetails: state.referralDetails,
  isLoading: state.referralDetails.isLoading,
  errorMessage: state.app.errorMessage,
  userType: state.app.userType
})

const mapDispatchToProps = { loadReferralData, acceptReferral }

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ViewReferralPage))
