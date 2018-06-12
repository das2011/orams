/* eslint-disable */
import React from 'react'
import { connect } from 'react-redux'

import AUpageAlert from '@gov.au/page-alerts/lib/js/react.js'
import LoadingIndicatorFullPage from 'shared/LoadingIndicatorFullPage/LoadingIndicatorFullPage'
import BaseForm from 'shared/form/BaseForm'
import Layout from 'shared/Layout'
import ServiceEditList from 'orams/components/ServiceEditList/ServiceEditList'
import PricingList from 'orams/components/PricingList/PricingList'
import EditPriceForm from 'orams/components/EditPriceForm/EditPriceForm'
import ContractVariation from 'orams/components/ContractVariation/ContractVariation'
import {
  loadServiceEditData,
  loadPricesData,
  setStep,
  setPrice,
  setUserPrice,
  setButtonClick,
  updatePrice,
  hideNav
} from 'orams/actions/editPriceActions'
import {
  SET_PRICE_LIST_SERVICES_STEP,
  SET_PRICE_LIST_PRICING_STEP,
  SET_PRICE_UPDATE_PRICE_STEP,
  SET_PRICE_CONTRACT_VARIATION_STEP
} from 'orams/constants/constants'

import styles from './PricingDetailsForm.scss'

class PricingDetailsForm extends BaseForm {
  static propTypes = {}

  componentDidMount() {
    this.props.loadServiceEdit(this.props.supplierCode)
  }

  loadStepTwo = (supplierCode, serviceTypeId, categoryId, serviceName, subCategoryName) => {
    this.props.loadPrices(supplierCode, serviceTypeId, categoryId, serviceName, subCategoryName)
  }

  buttonClick = value => {
    this.props.setButtonClickValue(value)
  }

  handlePriceSubmit = (model, capPrice) => {
    window.scrollTo(0, 0)
    this.props.setUserPriceData(model, capPrice)
  }

  submitUpdatePrice = data => {
    this.props.submitUpdatePrice(data)
  }

  mainSection() {
    if (this.props.currentlySending) {
      return <LoadingIndicatorFullPage />
    }

    if (this.props.errorMessage) {
      return (
        <AUpageAlert as="error">
          <h4>There was a problem loading the page</h4>
        </AUpageAlert>
      )
    }

    switch (this.props.step) {
      case SET_PRICE_LIST_SERVICES_STEP:
        return (
          <ServiceEditList editServiceData={this.props.editServiceData} linkClick={this.loadStepTwo} {...this.props} />
        )
      case SET_PRICE_LIST_PRICING_STEP:
        return <PricingList pricesData={this.props.pricesData} {...this.props} />
      case SET_PRICE_UPDATE_PRICE_STEP:
        return (
          <EditPriceForm
            priceData={this.props.priceData}
            {...this.props}
            handlePriceSubmit={this.handlePriceSubmit}
            buttonClick={this.buttonClick}
          />
        )
      case SET_PRICE_CONTRACT_VARIATION_STEP:
        return <ContractVariation {...this.props} submitUpdatePrice={this.submitUpdatePrice} />

      default:
        return ''
    }
  }

  render() {
    return (
      <Layout>
        {this.mainSection()}
      </Layout>
    )
  }
}

const mapStateToProps = state => {
  return {
    currentlySending: state.app.currentlySending,
    errorMessage: state.app.errorMessage,
    editServiceData: state.editPricing.editServiceData,
    pricesData: state.editPricing.pricesData,
    step: state.editPricing.step,
    priceData: state.editPricing.priceData,
    serviceToEdit: state.editPricing.serviceToEdit,
    pricesArray: state.editPricing.pricesArray,
    capPrice: state.editPricing.capPrice,
    supplier: state.editPricing.supplier,
    successMessage: state.editPricing.successMessage,
    supplierCode: state.app.supplierCode
  }
}

const mapDispatchToProps = dispatch => {
  return {
    loadServiceEdit: supplierCode => dispatch(loadServiceEditData(supplierCode)),
    loadPrices: (supplierCode, serviceTypeId, categoryId, serviceName, subCategoryName) =>
      dispatch(loadPricesData(supplierCode, serviceTypeId, categoryId, serviceName, subCategoryName)),
    goToStep: step => dispatch(setStep(step)),
    editPrice: priceToEditData => dispatch(setPrice(priceToEditData)),
    setUserPriceData: (price, capPrice) => dispatch(setUserPrice(price, capPrice)),
    setButtonClickValue: value => dispatch(setButtonClick(value)),
    submitUpdatePrice: data => dispatch(updatePrice(data)),
    hideNav: bool => dispatch(hideNav(bool))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PricingDetailsForm)
