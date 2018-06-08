import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import AUpageAlert from '@gov.au/page-alerts/lib/js/react.js'
import { uniqueID } from 'shared/utils/helpers'
import styles from './ResultsTable.scss'

class ResultsTable extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    this.focusIfNeeded()
  }

  componentDidUpdate() {
    this.focusIfNeeded()
  }

  onClickReferral(supplierCode, priceId, price) {
    this.props.setSelectedSupplierPrice({ priceId, price })
    this.props.history.push(`/referral-builder/${supplierCode}`)
  }

  setRef = c => {
    this._container = c // eslint-disable-line
  }

  focusIfNeeded() {
    if (this._container && this.props.tableFocus) {// eslint-disable-line
      this._container.focus()// eslint-disable-line
    }
  }

  renderAlert() {
    const { alert } = this.props.data
    return alert
      ? <AUpageAlert as={alert.type}>
          <h4>
            {alert.message}
          </h4>
        </AUpageAlert>
      : null
  }

  render() {
    const { categories } = this.props.data

    return (
      <div ref={this.setRef} className={styles.table}>
        {this.renderAlert()}
        <div className={styles.tableContainer}>
          {categories &&
            categories.map((category, id = uniqueID()) =>
              <div key={id + category.name}>
                <div className={styles.categoryTitle}>
                  {category.name}
                </div>
                {category.suppliers.map((supplier, uniqueId = uniqueID()) =>
                  <div key={uniqueId} className={styles.tableRow}>
                    <div className="row">
                      <div className="col-xs-12 col-sm-12">
                        <span className={styles.name}>
                          <a // eslint-disable-line
                            onClick={() => {
                              this.props.history.push(`/seller-profile/${supplier.code}`)
                            }}
                          >
                            {supplier.name}
                          </a>
                        </span>
                        <span className={styles.priceElements}>
                          <div className={styles.price}>
                            {`$${supplier.price}`}
                          </div>
                          <div className={styles.incGst}>inc GST</div>
                        </span>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-xs-12 col-sm-12">
                        <span className={styles.phone}>
                          {supplier.phone}
                        </span>
                        <span className={styles.email}>
                          <a href={`mailto:${supplier.email}`}>
                            {supplier.email}
                          </a>
                        </span>
                        <div className={styles.referral}>
                          <button
                            className="au-btn"
                            onClick={() => {
                              this.onClickReferral(supplier.code, supplier.priceId, supplier.price)
                            }}
                          >
                            Send Referral
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
        </div>
      </div>
    )
  }
}

ResultsTable.propTypes = {}

const mapStateToProps = () => ({})

const mapDispatchToProps = () => ({})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ResultsTable))
