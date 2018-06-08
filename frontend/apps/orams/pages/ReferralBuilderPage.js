import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter, Switch, Route } from 'react-router-dom'
import { createReferral } from 'orams/actions/referralActions'
import ReferralBuilderForm from 'orams/components/ReferralBuilderForm/ReferralBuilderForm'
import { loadSupplierProfile } from 'orams/actions/sellerCatalogueActions'

class ReferralBuilderPage extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    this.props.loadSupplierData(this.props.match.params.id)
  }

  handleCreateReferral = data => {
    const { doCreateReferral } = this.props
    doCreateReferral(data)
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
              <ReferralBuilderForm
                handleCreateReferralSubmit={this.handleCreateReferral}
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
  supplierData: state.sellersCatalogue.supplierData,
  regionCode: state.sellersCatalogue.region,
  regionsData: state.sellersCatalogue.regionsData,
  price: state.sellersCatalogue.price,
  organisation: state.app.organisation
})

const mapDispatchToProps = dispatch => ({
  loadSupplierData: id => dispatch(loadSupplierProfile(id)),
  doCreateReferral: data => dispatch(createReferral(data))
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ReferralBuilderPage))
