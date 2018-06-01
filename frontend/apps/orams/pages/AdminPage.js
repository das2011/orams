/* eslint-disable */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Form } from 'react-redux-form'
import { withRouter, Switch, Route } from 'react-router-dom'

import AUpageAlert from '@gov.au/page-alerts/lib/js/react.js'
import formProps from 'shared/form/formPropsSelector'
import LoadingIndicatorFullPage from 'shared/LoadingIndicatorFullPage/LoadingIndicatorFullPage'
import Textfield from 'shared/form/Textfield'
import { searchSupplier } from 'orams/actions/adminSearchActions'
import { ADMIN_SEARCH_TYPE_SUPPLIER, ADMIN_SEARCH_TYPE_USER } from 'orams/constants/constants'
import AdminSearch from 'orams/components/AdminSearch/AdminSearch'
import SupplierSearchForm from 'orams/components/SupplierSearchForm/SupplierSearchForm'
import supplierSearchResults from 'orams/components/SupplierSearchResults/SupplierSearchResults'
import { DISPLAY_STEP_2 } from '../constants/constants';
import SupplierSearchResults from '../components/SupplierSearchResults/SupplierSearchResults';

class AdminPage extends Component {
  constructor(props) {
    super(props)
    this.state = {}
      submitClicked: null
    }
  }

  handleSupplierSearch = (data) => {
    const { doSearchSupplier } = this.props
    doSearchSupplier(data)
  }

  renderSearchResults() {
    const { currentlySending, errorMessage, searchType, supplierSearchResult: searchResults } = this.props
    if (currentlySending) {
      return <LoadingIndicatorFullPage />
    }

    if (errorMessage) {
      return (
        <AUpageAlert as="error">
          <h4>{errorMessage}</h4>
        </AUpageAlert>
      )
    }

    if (searchType === ADMIN_SEARCH_TYPE_SUPPLIER ) {
      return <SupplierSearchResults 
        searchResults={searchResults} />
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
              <Switch>
            <div>
                <Route
                  exact
                  path={match.url}
                  render={() =>
                    <SearchUsersForm
                      model={model}
                      submitClicked={this.onSubmitClicked}
                      handleSubmit={values => this.handleSearchUsersSubmit(values)}
                    />}
                />
              </Switch>
            </div>
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
  model: PropTypes.string.isRequired,
  handleSearchUsersSubmit: PropTypes.func
}

  return {
    searchType,
    supplierSearchResult,
    userSearchResult,
    currentlySending,
    errorMessage
  }
}

const mapDispatchToProps = dispatch => ({
  return {
    setSupplierSearchTerm: searchTerm => dispatch(setSupplierSearchTerm(searchTerm)),
    doSearchSupplier: (searchTerm) => dispatch(searchSupplier(searchTerm))
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AdminPage))
