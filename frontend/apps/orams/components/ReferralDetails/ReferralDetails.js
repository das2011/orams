import React, { Component } from 'react'
import AUpageAlert from '@gov.au/page-alerts/lib/js/react.js'
import LoadingIndicatorFullPage from 'shared/LoadingIndicatorFullPage/LoadingIndicatorFullPage'
import styles from './ReferralDetails.scss'

const DETAILS_KEY_MAP = {
  supplier: 'Supplier',
  price: 'Price',
  dateCreated: 'Date of creation',
  location: 'Location',
  createdBy: 'Created By',
  referralId: 'Referral ID',
  agency: 'Agency',
  info: 'Other info'
}

export default class ReferralDetails extends Component {
  static renderDetailsItem(title, value) {
    return (
      <div className="row" key={title}>
        <div className="col-sm-3 col-xs-12">
          <div>
            {title}
          </div>
        </div>
        <div>
          {value}
        </div>
      </div>
    )
  }

  static renderDisclaimerText() {
    return <div className="row">Disclaimer:</div>
  }

  renderAllDetails() {
    const details = { ...this.props.referralDetails }

    return Object.keys(details).map(k => ReferralDetails.renderDetailsItem(DETAILS_KEY_MAP[k], details[k]))
  }

  render() {
    if (this.props.isLoading) {
      return <LoadingIndicatorFullPage />
    } else if (this.props.errorMessage) {
      return (
        <div className={styles.banner}>
          <AUpageAlert as="error">
            <h4>
              {this.props.errorMessage}
            </h4>
          </AUpageAlert>
        </div>
      )
    }
    return (
      <main>
        <div className="row">
          <div className="col-xs-12 col-sm-12">
            <h1 className="au-display-xl">Referral Details</h1>
          </div>
        </div>

        {this.renderAllDetails()}
        {ReferralDetails.renderDisclaimerText()}
      </main>
    )
  }
}
