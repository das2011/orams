/* eslint-disable */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import styles from './AdminSearch.scss'

class AdminSearch extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  //
  // tableSection() {
  //   if (this.props.currentlySending) {
  //     return <LoadingIndicatorFullPage />
  //   }
  //
  //   if (this.props.errorMessage) {
  //     return (
  //       <AUpageAlert as="error">
  //         <h4>There was a problem loading your results</h4>
  //       </AUpageAlert>
  //     )
  //   }
  //
  //   return <ResultsTable {...this.props} data={this.props.tableData} />
  // }

  onClickSearchUser(supplierCode, price){
    this.props.setSelectedSupplierPrice(price)
    this.props.history.push(`/referral-builder/${supplierCode}`)
  }

  render() {
    return (
      <main>
        <div className="row">
          <div className="col-xs-12 col-sm-9">
            <div className="au-display-xl">
              Search
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-3 col-xs-12">
            <div className={styles.title}>Search User By Email</div>
          </div>
        </div>

        <div className="row">
          <div className={styles.badge}>
            <input type="search" id="searchUser" name="string" size="50" value={this.state.userString}
                   placeholder="Search user like john@ato.gov.au or just john"/>
            <button className="au-btn" onClick={() => {
              this.onClickSearchUser()
            }}
            >Search
            </button>
          </div>
        </div>

        <div className="col-xs-12 col-sm-8 col-sm-push-1">
          {/*{this.tableSection()}*/}
        </div>

      </main>
    )
  }
}

AdminSearch.propTypes = {}

const mapStateToProps = state => {
  return {}
}

export default connect(mapStateToProps)(AdminSearch)
