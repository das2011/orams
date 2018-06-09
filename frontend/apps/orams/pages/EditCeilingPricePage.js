import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import AUpageAlert from '@gov.au/page-alerts/lib/js/react.js'
import LoadingIndicatorFullPage from 'shared/LoadingIndicatorFullPage/LoadingIndicatorFullPage'
import { hideNav, loadServiceEditData  } from 'orams/actions/editPriceActions'
import ServiceEditList from 'orams/components/ServiceEditList/ServiceEditList'

const LIST_SERVICES_STEP = 1
const LIST_PRICING_STEP = 2
const UPDATE_CEILING_PRICE_STEP = 3

class EditCeilingPricePage extends Component {
  componentDidMount() {
    const { loadServiceEdit, supplierCode } = this.props
    loadServiceEdit(supplierCode)
  }

  loadListPricingStep(supplierCode, serviceTypeId, categoryId, serviceName, subCategoryName) {
    /* eslint-disable class-method-use-this */
    // this.props.loadPrices(supplierCode, serviceTypeId, categoryId, serviceName, subCategoryName)
    console.log(`supplierCode: ${supplierCode}`)
    console.log(`serviceTypeId: ${serviceTypeId}`)
    console.log(`categoryId: ${categoryId}`)
    console.log(`serviceName: ${serviceName}`)
    console.log(`subCategoryName: ${subCategoryName}`)
    /* eslint-enable */
  }

  render() {
    const { currentlySending, errorMessage, step } = this.props
    const isCeilingPriceUpdate = true

    if (currentlySending) {
      return <LoadingIndicatorFullPage />
    }

    if (errorMessage) {
      return (
        <AUpageAlert as="error">
          <h4>There was a problem loading the page</h4>
        </AUpageAlert>
      )
    }

    switch (step) {
      case LIST_SERVICES_STEP:
        return (
          <ServiceEditList
            editServiceData={this.props.editServiceData}
            linkClick={this.loadListPricingStep}
            isCeilingPriceUpdate={isCeilingPriceUpdate}
            {...this.props}
          />
        )

      case LIST_PRICING_STEP:
        return <div>Pricing Step</div>

      case UPDATE_CEILING_PRICE_STEP:
        return <div>Update Ceiling Price Step</div>

      default:
        return ''
    }
  }
}

const mapStateToProps = state => {
  const { currentlySending, errorMessage } = state.app
  const { supplierCode, editServiceData, pricesData, step, successMessage } = state.editPricing

  return {
    supplierCode,
    currentlySending,
    errorMessage,
    editServiceData,
    pricesData,
    step,
    // priceData: state.editPricing.priceData,
    // serviceToEdit: state.editPricing.serviceToEdit,
    // pricesArray: state.editPricing.pricesArray,
    // capPrice: state.editPricing.capPrice,
    // supplier: state.editPricing.supplier,
    successMessage
  }
}

const mapDispatchToProps = dispatch => ({
  loadServiceEdit: supplierCode => dispatch(loadServiceEditData(supplierCode)),
  hideNav: bool => dispatch(hideNav(bool))
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(EditCeilingPricePage))
