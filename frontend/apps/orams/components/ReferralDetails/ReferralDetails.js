import React, { Component } from 'react'
import parseDate from 'date-fns/parse'
import format from 'date-fns/format'
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
  agency: 'Agency'
}

export default class ReferralDetails extends Component {
  static renderDetailsItem(title, value) {
    return (
      <div className={`row ${styles.detailsRow}`} key={title}>
        <div className="col-sm-3 col-xs-12">
          <div className={styles.title}>
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

  static renderHorizontalLine() {
    return <div className={styles.horizontalSeparatorLine} />
  }

  renderAllDetails() {
    const details = { ...this.props.referralDetails }
    const referralDetails = {
      supplier: details.supplier,
      price: `$${details.price} incl GST`,
      dateCreated: format(parseDate(details.dateCreated), 'DD MMM YYYY'),
      location: `${details.regionName} ${details.regionState}`,
      createdBy: details.createdBy,
      referralId: details.referralId,
      agency: details.agency
    }

    return Object.keys(DETAILS_KEY_MAP).map(k =>
      ReferralDetails.renderDetailsItem(DETAILS_KEY_MAP[k], referralDetails[k])
    )
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
        <div className={`row ${styles.headerSection}`}>
          <div className="col-xs-12 col-sm-12">
            <h1 className="au-display-xl">Referral Details</h1>
          </div>
        </div>

        {this.renderAllDetails()}

        {ReferralDetails.renderHorizontalLine()}
        {ReferralDetails.renderDisclaimerText()}
      </main>
    )
  }
}
