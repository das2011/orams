/* eslint-disable */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { uniqueID } from 'shared/utils/helpers'
import LoadingIndicatorFullPage from 'shared/LoadingIndicatorFullPage/LoadingIndicatorFullPage'

import styles from './ReferralBuilder.scss'

class ReferralBuilder extends Component {
  constructor(props) {
    super(props)
    this.state = {}
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

  renderReferralInfo(supplierData, regionCode, regionsData, price, organisation) {
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
          <button className="au-btn" onClick={() => {
            this.props.history.goBack()
          }}
          >Cancel
          </button>
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

ReferralBuilder.propTypes = {}

const mapStateToProps = state => {
  return {}
}

export default connect(mapStateToProps)(ReferralBuilder)
