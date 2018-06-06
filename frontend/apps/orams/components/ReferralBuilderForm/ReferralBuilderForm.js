/* eslint-disable */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { uniqueID } from 'shared/utils/helpers'
import LoadingIndicatorFullPage from 'shared/LoadingIndicatorFullPage/LoadingIndicatorFullPage'
import Textfield from 'shared/form/Textfield'
import formProps from 'shared/form/formPropsSelector'
import { Form } from 'react-redux-form'

import styles from './ReferralBuilderForm.scss'
import PropTypes from 'prop-types'

class ReferralBuilderForm extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  static propTypes = {
    handleCreateReferralSubmit: PropTypes.func.isRequired
  }

  retrieveRegionName(regionCode, regionData) {
    let regionName = ''
    let subRegionName = ''
    for (const region of regionData.regions) {
      const foundSubRegion = region.subRegions.find((subRegion) => {
        return subRegion.id == regionCode
      })
      if (foundSubRegion) {
        regionName = region.name
        subRegionName = foundSubRegion.name
        break
      }
    }
    return regionName + ' ' + subRegionName
  }

  goBack = (props) => {
    this.props.history.goBack()
  }

  handleSubmit(data) {
    const { price, handleCreateReferralSubmit } = this.props
    handleCreateReferralSubmit({ serviceTypePriceId: price.priceId })
  }

  renderReferralInfo(supplierData, regionCode, regionsData, price, organisation) {
    const { model } = this.props

    return (
      <div>
        <div>
          <main>
            <div className="row">
              <div className="col-xs-12 col-sm-9">
                <div className="au-display-xl">
                  Send Referral
                </div>
              </div>
            </div>
          </main>
        </div>

        <div className={styles.separator}/>

        <div className={styles.informationSection}>
          <main>
            <div className="row">
              <div className="col-sm-8 col-xs-12">

                <div className="row">
                  <div className="col-sm-3 col-xs-12">
                    <div className={styles.title}>Supplier</div>
                  </div>
                  <div className="col-sm-8 col-sm-push-1 col-xs-12">
                    <div> {supplierData.name}</div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-sm-3 col-xs-12">
                    <div className={styles.title}>Services</div>
                  </div>
                  <div className="col-sm-8 col-sm-push-1 col-xs-12">
                    <div> {supplierData.category_name}</div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-sm-3 col-xs-12">
                    <div className={styles.title}>Operates in</div>
                  </div>
                  <div className="col-sm-8 col-sm-push-1 col-xs-12">
                    <div> {this.retrieveRegionName(regionCode, regionsData)}</div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-sm-3 col-xs-12">
                    <div className={styles.title}>Price</div>
                  </div>
                  <div className="col-sm-8 col-sm-push-1 col-xs-12">
                    <div>
                       <span className={styles.priceElements}>
                          <div className={styles.price}>
                            {'$' + price.price + ' ' + 'inc GST'}
                            </div>
                        </span>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-sm-3 col-xs-12">
                    <div className={styles.title}>Buyer Organisation</div>
                  </div>
                  <div className="col-sm-8 col-sm-push-1 col-xs-12">
                    <div> {organisation} </div>
                  </div>
                </div>

              </div>
            </div>

          </main>
        </div>

        <div>
          <Form model={model} id="createReferral" action="" onSubmit={data => this.handleSubmit(data)}>
            <Textfield
              model={`${model}.field1`}
              name="field1"
              id="field1"
              htmlFor="field1"
              label="field1"
              description="oh oh, a field here"
            />
            <button type="cancel" className="au-btn" onClick={() => {
              this.props.history.goBack()
            }}
            >Cancel
            </button>

            <button type="submit" className="au-btn">
              Submit
            </button>
          </Form>
        </div>

        <div>
        </div>

        <div>
          <main>
          </main>
        </div>


      </div>
    )
  }

  renderReferralBuilder(supplierData, regionCode, regionsData, price, organisation) {
    return this.renderReferralInfo(supplierData, regionCode, regionsData, price, organisation)
  }

  renderLoadingIndicatorFullPage() {
    return (
      <div>
        <LoadingIndicatorFullPage/>
      </div>
    )
  }

  render() {
    const { supplierData, regionCode, regionsData, price, organisation } = this.props

    const showReferralInfo = supplierData && regionCode && regionsData && price && organisation
    if (showReferralInfo) {
      return this.renderReferralBuilder(supplierData, regionCode, regionsData, price, organisation)
    }
    else {
      return this.renderLoadingIndicatorFullPage()
    }
  }
}

ReferralBuilderForm.propTypes = {}

const mapStateToProps = state => ({
  ...formProps(state, 'referralBuilderForm')
})

export { Textfield, mapStateToProps, ReferralBuilderForm as Form }

export default connect(mapStateToProps)(ReferralBuilderForm)
