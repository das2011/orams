import React from 'react'
import Alert from '@gov.au/page-alerts/lib/js/react.js'
import { uniqueID } from 'shared/utils/helpers'
import styles from './PricingList.scss'

const PricingList = props => {
  const { pricesData, successMessage, hideNav, serviceToEdit, supplier, isCeilingPriceUpdate } = props
  const { prices } = pricesData

  const renderSuccessMessage = () => {
    const message = isCeilingPriceUpdate ? 'Ceiling price updated' : 'Pricing updated'

    if (successMessage) {
      return (
        <Alert as="success">
          <h4>
            {message}
          </h4>
        </Alert>
      )
    }

    return ''
  }

  const renderHeader = () => {
    if (isCeilingPriceUpdate) {
      const supplierName = supplier ? supplier.name : ''

      return (
        <header>
          <h1 className="au-display-xl">
            {supplierName}
          </h1>
          <h2 className="au-display-lg">Update ceiling prices - select a region</h2>
          <div className={styles.stepTitle}>Step 2 of 3</div>
          <div
            role="button"
            tabIndex="0"
            className={styles.backLink}
            onClick={() => {
              hideNav(false)
              props.goToStep(1)
            }}
          >
            Back to supplier search
          </div>
        </header>
      )
    }

    return (
      <header>
        <h1 className="au-display-xl" tabIndex="-1">
          Pricing for {serviceToEdit.serviceName}
          <span>{serviceToEdit.subCategoryName ? ` (${serviceToEdit.subCategoryName})` : ''}</span>
        </h1>
        <div className={styles.stepTitle}>Step 2 of 4</div>
        <div
          role="button"
          tabIndex="0"
          className={styles.backLink}
          onClick={() => {
            hideNav(false)
            props.goToStep(1)
          }}
        >
          Back to services list
        </div>
      </header>
    )
  }

  return (
    <div className={styles.container}>
      {renderSuccessMessage()}
      {renderHeader()}
      <article role="main">
        <div className={styles.headingRow}>
          <div className="row">
            <div className="col-md-3 col-sm-3">Region</div>
            <div className="col-md-2 col-sm-2">Price cap</div>
            <div className="col-md-2 col-sm-2">
              Price <span className={styles.gstTitle}>inc GST</span>
            </div>
            <div className="col-md-2 col-sm-2">Start date</div>
            <div className="col-md-2 col-sm-2">End date</div>
            <div className="col-md-1 col-sm-1" />
          </div>
        </div>
        {prices &&
          prices.map((price, id = uniqueID()) =>
            <div key={id} className={styles.priceRow}>
              <div className="row">
                <div className="col-md-3 col-sm-3">
                  {`${price.region.state} ${price.region.name}`}
                </div>
                <div className="col-md-2 col-sm-2">
                  {`$${price.capPrice}`}
                </div>
                <div className="col-md-2 col-sm-2">
                  <span className={styles.price}>
                    {`$${price.price}`}
                  </span>
                </div>
                <div className="col-md-2 col-sm-2">
                  {price.startDate}
                </div>
                <div className="col-md-2 col-sm-2">
                  {price.endDate}
                </div>
                <div className="col-md-1 col-sm-1">
                  <div
                    role="button"
                    tabIndex="0"
                    className={styles.link}
                    onClick={() => {
                      props.editPrice(price)
                      window.scrollTo(0, 0)
                    }}
                  >
                    <strong>Edit</strong>
                  </div>
                </div>
              </div>
            </div>
          )}
      </article>
    </div>
  )
}

export default PricingList
