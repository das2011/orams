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
  setStep,
  updateCeilingPrice
} from 'orams/actions/editPriceActions'
import {
  SET_PRICE_LIST_SERVICES_STEP,
  SET_PRICE_LIST_PRICING_STEP,
  SET_PRICE_UPDATE_PRICE_STEP
} from 'orams/constants/constants'
import EditCeilingPriceForm from 'orams/components/EditCeilingPriceForm/EditCeilingPriceForm'
import PricingList from 'orams/components/PricingList/PricingList'
import ServiceEditList from 'orams/components/ServiceEditList/ServiceEditList'

class EditCeilingPricePage extends Component {
  constructor(props) {
    super(props)

    this.loadListPricingStep = this.loadListPricingStep.bind(this)
    this.handlePriceSubmit = this.handlePriceSubmit.bind(this)
  }

  componentDidMount() {
    const { loadServiceEdit, supplierCode } = this.props
    loadServiceEdit(supplierCode)
  }

  loadListPricingStep(supplierCode, serviceTypeId, categoryId, serviceName, subCategoryName) {
    this.props.loadPrices(supplierCode, serviceTypeId, categoryId, serviceName, subCategoryName)
  }

  handlePriceSubmit(data, capPriceId) {
    this.props.submitUpdateCeilingPrice(data, capPriceId)
  }

  renderMain() {
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
      case SET_PRICE_LIST_SERVICES_STEP:
        return (
          <ServiceEditList
            editServiceData={this.props.editServiceData}
            linkClick={this.loadListPricingStep}
            isCeilingPriceUpdate={isCeilingPriceUpdate}
            {...this.props}
          />
        )

      case SET_PRICE_LIST_PRICING_STEP:
        return (
          <PricingList pricesData={this.props.pricesData} isCeilingPriceUpdate={isCeilingPriceUpdate} {...this.props} />
        )

      case SET_PRICE_UPDATE_PRICE_STEP:
        return <EditCeilingPriceForm {...this.props} handlePriceSubmit={this.handlePriceSubmit} />

      default:
        return ''
    }
  }

  render() {
    return (
      <main>
        <div className="row">
          {this.renderMain()}
        </div>
      </main>
    )
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
  submitUpdateCeilingPrice: (data, capPriceId) => dispatch(updateCeilingPrice(data, capPriceId)),
  goToStep: step => dispatch(setStep(step)),
  hideNav: bool => dispatch(hideNav(bool))
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(EditCeilingPricePage))
