import React from 'react'
import { uniqueID } from 'shared/utils/helpers'
import AUpageAlert from '@gov.au/page-alerts/lib/js/react.js'
import styles from './ServiceEditList.scss'

const ServiceEditList = props => {
  const { editServiceData, linkClick, successMessage, hideNav, supplierCode, isCeilingPriceUpdate } = props
  const { services, name: supplierName } = editServiceData

  const renderSuccessMessage = () => {
    const message = isCeilingPriceUpdate ? 'Ceiling price updated' : 'Pricing updated'

    if (successMessage) {
      return (
        <AUpageAlert as="success">
          <h4>
            {message}
          </h4>
        </AUpageAlert>
      )
    }

    return ''
  }

  const renderHeading = () => {
    if (isCeilingPriceUpdate) {
      return (
        <header>
          <h1 className="au-display-xl" tabIndex="-2">
            {supplierName}
          </h1>
          <h2 className="au-display-lg" tabIndex="-1">
            Update ceiling prices - select a service
          </h2>
          <div className={styles.stepTitle}>Step 1 of 4</div>
          <div>
            <a
              onClick={() => {
                props.history.goBack()
              }}
            >
              Back to supplier search
            </a>
          </div>
          <div className={styles.heading}>Select the service you want to edit</div>
        </header>
      )
    }

    return (
      <header>
        <h1 className="au-display-xl" tabIndex="-1">
          Pricing
        </h1>
        <div className={styles.stepTitle}>Step 1 of 4</div>
        <div className={styles.heading}>Select the service you want to edit</div>
      </header>
    )
  }

  return (
    <div className={styles.container}>
      {renderSuccessMessage()}
      {renderHeading()}
      <article role="main">
        {services &&
          services.map((service, id = uniqueID()) =>
            <div key={id}>
              {service.subCategories.map((subCategory, subId = uniqueID()) =>
                <div
                  key={subId}
                  onClick={() => {
                    hideNav(true)
                    linkClick(
                      supplierCode,
                      service.id,
                      subCategory.id,
                      service.name,
                      subCategory.name ? subCategory.name : ''
                    )
                    window.scrollTo(0, 0)
                  }}
                >
                  <div className={styles.link}>
                    {service.name}
                    <span>
                      {subCategory.name ? ` (${subCategory.name})` : ''}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
      </article>
    </div>
  )
}

export default ServiceEditList
