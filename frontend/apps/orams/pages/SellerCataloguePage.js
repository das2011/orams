/* eslint-disable */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter, Switch, Route } from 'react-router-dom'
import SellerCatalogue from 'orams/components/SellerCatalogue/SellerCatalogue'
import {
  loadRegions,
  loadServices,
  loadSuppliers,
  setCategoryData,
  setRegion,
  setSelectedSupplierPrice,
  setRegionAccordionOpen,
  setCategoryAccordionOpen
} from 'orams/actions/sellerCatalogueActions'

class SellerCataloguePage extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const { match, regionsData, servicesData, tableData, region } = this.props

    return (
      <Switch>
        <Route
          exact
          path={match.url}
          render={() =>
            <SellerCatalogue
              regionsData={regionsData}
              servicesData={servicesData}
              tableData={tableData}
              region={region}
              {...this.props}
            />}
        />
      </Switch>
    )
  }
}

SellerCataloguePage.propTypes = {
  match: PropTypes.object.isRequired
}

const mapStateToProps = state => {
  return {
    region: state.sellersCatalogue.region,
    category: state.sellersCatalogue.category,
    regionsData: state.sellersCatalogue.regionsData,
    servicesData: state.sellersCatalogue.servicesData,
    tableData: state.sellersCatalogue.tableData,
    currentlySending: state.app.currentlySending,
    errorMessage: state.app.errorMessage,
    tableFocus: state.sellersCatalogue.tableFocus
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setRegion: region => dispatch(setRegion(region)),
    loadRegionsData: () => dispatch(loadRegions()),
    loadServicesData: () => dispatch(loadServices()),
    setSelectedSupplierPrice: price => dispatch(setSelectedSupplierPrice(price)),
    setCategory: category => dispatch(setCategoryData(category)),
    onRegionAccordionOpen: id => dispatch(setRegionAccordionOpen(id)),
    onCategoryAccordionOpen: id => dispatch(setCategoryAccordionOpen(id)),
    loadTableData: (region, category) => dispatch(loadSuppliers(region, category))
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SellerCataloguePage))
