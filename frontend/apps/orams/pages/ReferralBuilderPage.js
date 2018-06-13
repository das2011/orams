import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter, Switch, Route } from 'react-router-dom'
import { createReferral, saveReferralBuilder1FormData, loadReferralInfoByPriceId } from 'orams/actions/referralActions'
import ReferralBuilder from 'orams/components/ReferralBuilder/ReferralBuilder'

class ReferralBuilderPage extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    this.props.loadReferralInfo(this.props.match.params.id)
  }

  handleCreateReferral1Form = data => {
    const { saveReferral1FormData } = this.props
    saveReferral1FormData(data)
  }

  render() {
    const { match } = this.props

    return (
      <div>
        <Switch>
          <Route
            exact
            path={match.url}
            render={() =>
              <ReferralBuilder
                handleReferralBuilder1FormSubmit={this.handleCreateReferral1Form}
                id={match.params.id}
                {...this.props}
              />}
          />
        </Switch>
      </div>
    )
  }
}

ReferralBuilderPage.propTypes = {
  match: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  referralInfoData: state.referralDetails.referralInfoData,
  organisation: state.app.organisation
})

const mapDispatchToProps = dispatch => ({
  loadReferralInfo: id => dispatch(loadReferralInfoByPriceId(id)),
  doCreateReferral: data => dispatch(createReferral(data)),
  saveReferral1FormData: data => dispatch(saveReferralBuilder1FormData(data))
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ReferralBuilderPage))
