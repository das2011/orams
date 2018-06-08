import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Form } from 'react-redux-form'
import PropTypes from 'prop-types'
import LoadingIndicatorFullPage from 'shared/LoadingIndicatorFullPage/LoadingIndicatorFullPage'
import Textfield from 'shared/form/Textfield'
import formProps from 'shared/form/formPropsSelector'
import styles from './ReferralBuilderForm.scss'

class ReferralBuilderForm extends Component {
  static propTypes = {
    handleCreateReferralSubmit: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {}
  }

  retrieveRegionName() {
    /* eslint-disable no-restricted-syntax */
    const { regionCode, regionsData } = this.props
    let regionName = ''
    let subRegionName = ''
    for (const region of regionsData.regions) {
      const foundSubRegion = region.subRegions.find(subRegion => subRegion.id === parseInt(regionCode, 10))
      if (foundSubRegion) {
        regionName = region.name
        subRegionName = foundSubRegion.name
        break
      }
    }
    return `${regionName} ${subRegionName}`
    /* eslint-enable no-restricted-syntax */
  }

  goBack = () => {
    this.props.history.goBack()
  }

  handleSubmit() {
    const { price, handleCreateReferralSubmit } = this.props
    handleCreateReferralSubmit({ serviceTypePriceId: price.priceId })
  }

  renderReferralInfo() {
    const { model, supplierData, price, organisation } = this.props

    return (
      <div>
        <div>
          <main>
            <div className="row">
              <div className="col-xs-12 col-sm-9">
                <div className="au-display-xl">Send Referral</div>
              </div>
            </div>
          </main>
        </div>

        <div className={styles.separator} />

        <div className={styles.informationSection}>
          <main>
            <div className="row">
              <div className="col-sm-8 col-xs-12">
                <div className="row">
                  <div className="col-sm-3 col-xs-12">
                    <div className={styles.title}>Supplier</div>
                  </div>
                  <div className="col-sm-8 col-sm-push-1 col-xs-12">
                    <div>
                      {supplierData.name}
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-sm-3 col-xs-12">
                    <div className={styles.title}>Services</div>
                  </div>
                  <div className="col-sm-8 col-sm-push-1 col-xs-12">
                    <div>
                      {supplierData.category_name}
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-sm-3 col-xs-12">
                    <div className={styles.title}>Operates in</div>
                  </div>
                  <div className="col-sm-8 col-sm-push-1 col-xs-12">
                    <div>
                      {this.retrieveRegionName()}
                    </div>
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
                          {`$${price.price} inc GST`}
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
                    <div>
                      {organisation}
                    </div>
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
            <button
              type="cancel"
              className="au-btn"
              onClick={() => {
                this.props.history.goBack()
              }}
            >
              Cancel
            </button>

            <button type="submit" className="au-btn">
              Submit
            </button>
          </Form>
        </div>

        <div />

        <div>
          <main />
        </div>
      </div>
    )
  }

  render() {
    const { supplierData, regionCode, regionsData, price, organisation } = this.props
    const showReferralInfo = supplierData && regionCode && regionsData && price && organisation
    if (showReferralInfo) {
      return this.renderReferralInfo()
    }
    return (
      <div>
        <LoadingIndicatorFullPage />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  ...formProps(state, 'referralBuilderForm')
})

export { Textfield, mapStateToProps, ReferralBuilderForm as Form }

export default connect(mapStateToProps)(ReferralBuilderForm)
