/* eslint-disable */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter, Switch, Route } from 'react-router-dom'
import AUpageAlert from '@gov.au/page-alerts/lib/js/react.js'
import LoadingIndicatorFullPage from 'shared/LoadingIndicatorFullPage/LoadingIndicatorFullPage'
import { searchSupplier, searchUser } from 'orams/actions/adminSearchActions'
import { ADMIN_SEARCH_TYPE_SUPPLIER, ADMIN_SEARCH_TYPE_USER } from 'orams/constants/constants'
import SupplierSearchForm from 'orams/components/SupplierSearchForm/SupplierSearchForm'
import UserSearchForm from '../components/UserSearchForm/UserSearchForm'
import SupplierSearchResults from '../components/SupplierSearchResults/SupplierSearchResults'
import UserSearchResults from '../components/UserSearchResults/UserSearchResults'


class AdminPage extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  handleSupplierSearch = (data) => {
    const { doSearchSupplier } = this.props
    doSearchSupplier(data)
  }

  handleUserSearch = (data) => {
    const { doSearchUser } = this.props
    doSearchUser(data)
  }

  renderSearchResults() {
    const { currentlySending, errorMessage, searchType, supplierSearchResult, userSearchResult } = this.props
    if (currentlySending) {
      return <LoadingIndicatorFullPage/>
    }

    if (errorMessage) {
      return (
        <AUpageAlert as="error">
          <h4>{errorMessage}</h4>
        </AUpageAlert>
      )
    }

    if (searchType === ADMIN_SEARCH_TYPE_SUPPLIER) {
      return <SupplierSearchResults
        searchResults={supplierSearchResult}/>
    }

    if (searchType === ADMIN_SEARCH_TYPE_USER) {
      return <UserSearchResults
        {...this.props}
        searchResults={userSearchResult}/>
    }

    return ''
  }

  render() {
    return (
      <main>
        <div className="row">
          <div className="col-xs-12 col-sm-9">
            <div className="au-display-xl">Welcome</div>
            <div>Tasks you can do here are shown below</div>
          </div>
        </div>

        <div className="row">
          <div className="col-sm-3 col-xs-12">
            <SupplierSearchForm
              handleSearchSubmit={this.handleSupplierSearch}
            />
            <UserSearchForm
              handleSearchSubmit={this.handleUserSearch}
            />
          </div>

          <div className="col-sm-8 col-xs-12 col-sm-push-1">
            {this.renderSearchResults()}
          </div>
        </div>
      </main>
    )
  }
}

const mapStateToProps = state => {
  const {
    searchType,
    supplierSearchResult,
    userSearchResult
  } = state.adminSearch

  const { currentlySending, errorMessage } = state.app

  return {
    searchType,
    supplierSearchResult,
    userSearchResult,
    currentlySending,
    errorMessage
  }
}

const mapDispatchToProps = dispatch => {
  return {
    doSearchSupplier: (searchTerm) => dispatch(searchSupplier(searchTerm)),
    doSearchUser: (searchTerm) => dispatch(searchUser(searchTerm))

  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AdminPage))