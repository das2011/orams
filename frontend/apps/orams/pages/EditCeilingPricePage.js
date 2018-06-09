import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import AUpageAlert from '@gov.au/page-alerts/lib/js/react.js'
import LoadingIndicatorFullPage from 'shared/LoadingIndicatorFullPage/LoadingIndicatorFullPage'
import {
  hideNav,
  loadPricesData,
  loadServiceEditData,
  setCeilingPriceToEdit,
  setStep
} from 'orams/actions/editPriceActions'
import PricingList from 'orams/components/PricingList/PricingList'
import ServiceEditList from 'orams/components/ServiceEditList/ServiceEditList'

const LIST_SERVICES_STEP = 1
const LIST_PRICING_STEP = 2
const UPDATE_CEILING_PRICE_STEP = 3

class EditCeilingPricePage extends Component {
  constructor(props) {
    super(props)

    this.loadListPricingStep = this.loadListPricingStep.bind(this)
  }

  componentDidMount() {
    const { loadServiceEdit, supplierCode } = this.props
    loadServiceEdit(supplierCode)
  }

  loadListPricingStep(supplierCode, serviceTypeId, categoryId, serviceName, subCategoryName) {
    this.props.loadPrices(supplierCode, serviceTypeId, categoryId, serviceName, subCategoryName)
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
        return <PricingList pricesData={this.props.pricesData} {...this.props} />

      case UPDATE_CEILING_PRICE_STEP:
        return <div>Update Ceiling Price Step</div>

      default:
        return ''
    }
  }
}

const mapStateToProps = state => {
  const { currentlySending, errorMessage } = state.app
  const {
    supplierCode,
    editServiceData,
    pricesData,
    step,
    successMessage,
    priceData,
    serviceToEdit,
    pricesArray,
    capPrice,
    supplier
  } = state.editPricing

  return {
    supplierCode,
    currentlySending,
    errorMessage,
    editServiceData,
    pricesData,
    step,
    priceData,
    serviceToEdit,
    pricesArray,
    capPrice,
    supplier,
    successMessage
  }
}

const mapDispatchToProps = dispatch => ({
  loadServiceEdit: supplierCode => dispatch(loadServiceEditData(supplierCode)),
  loadPrices: (supplierCode, serviceTypeId, categoryId, serviceName, subCategoryName) =>
    dispatch(loadPricesData(supplierCode, serviceTypeId, categoryId, serviceName, subCategoryName)),
  editPrice: priceToEditData => dispatch(setCeilingPriceToEdit(priceToEditData)),
  goToStep: step => dispatch(setStep(step)),
  hideNav: bool => dispatch(hideNav(bool))
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(EditCeilingPricePage))
