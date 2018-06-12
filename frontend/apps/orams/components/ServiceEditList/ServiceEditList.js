import React from 'react'
import { uniqueID } from 'shared/utils/helpers'
import AUpageAlert from '@gov.au/page-alerts/lib/js/react.js'
import styles from './ServiceEditList.scss'

const ServiceEditList = props => {
  const { editServiceData, linkClick, successMessage, hideNav, supplierCode, supplier, isCeilingPriceUpdate } = props
  const { services } = editServiceData

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
      const supplierName = supplier ? supplier.name : ''

      return (
        <header>
          <h1 className="au-display-xl">
            {supplierName}
          </h1>
          <h2 className="au-display-lg">Update ceiling prices - select a service</h2>
          <div className={styles.stepTitle}>Step 1 of 3</div>
          <div
            role="button"
            tabIndex="0"
            className={`${styles.link} link-back`}
            onClick={() => {
              props.history.goBack()
            }}
          >
            Back to suppliers
          </div>
          <div className={styles.heading}>Select the service you want to edit</div>
        </header>
      )
    }

    return (
      <header>
        <h1 className="au-display-xl">Pricing</h1>
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
                  <div className={`${styles.link} link-service`}>
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
