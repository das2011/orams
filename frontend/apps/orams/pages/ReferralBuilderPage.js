/* eslint-disable */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter, Switch, Route } from 'react-router-dom'
import ReferralBuilder from 'orams/components/ReferralBuilder/ReferralBuilder'
import {
  loadSupplierProfile
} from 'orams/actions/sellerCatalogueActions'

class ReferralBuilderPage extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    this.props.loadSupplierData(this.props.match.params.id)
  }

  render() {
    const { match } = this.props

    return (
      <div>
        <Switch>
          <Route exact path={match.url} render={() => <ReferralBuilder id={match.params.id} {...this.props} />}/>
        </Switch>
      </div>

    )
  }
}

ReferralBuilderPage.propTypes = {
  match: PropTypes.object.isRequired
}

const mapStateToProps = state => {
  return {
    supplierData: state.sellersCatalogue.supplierData,
    regionCode: state.sellersCatalogue.region,
    regionsData: state.sellersCatalogue.regionsData,
    price: state.sellersCatalogue.price,
    organisation: state.app.organisation
  }
}

const mapDispatchToProps = dispatch => {
  return {
    loadSupplierData: id => dispatch(loadSupplierProfile(id))
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ReferralBuilderPage))
