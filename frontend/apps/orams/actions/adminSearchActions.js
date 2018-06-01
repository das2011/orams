<<<<<<< HEAD
import {
  ACTION_SET_SUPPLIER_SEARCH,
  ACTION_SET_SUPPLIER_SEARCH_TERM,
  SENDING_REQUEST,
  SET_ERROR_MESSAGE
} from 'orams/constants/constants'
import { GENERAL_ERROR } from 'orams/constants/messageConstants'
import dmapi from 'orams/services/apiClient'

export const sendingRequest = sending => ({ type: SENDING_REQUEST, sending })

const setErrorMessage = errorMessage => ({
=======
import { GENERAL_ERROR } from 'orams/constants/messageConstants'
import { SET_USER_TABLE_DATA, SENDING_REQUEST, SET_ERROR_MESSAGE } from 'orams/constants/constants'
import dmapi from 'orams/services/apiClient'

export function setUserTableData(userTableData) {
  return { type: SET_USER_TABLE_DATA, userTableData }
}

export const sendingRequest = sending => ({ type: SENDING_REQUEST, sending })

export const setErrorMessage = errorMessage => ({
>>>>>>> Added actions and reducers for admin search
  type: SET_ERROR_MESSAGE,
  errorMessage
})

<<<<<<< HEAD
const setSupplierSearchResult = searchResult => ({
  type: ACTION_SET_SUPPLIER_SEARCH,
  supplierSearchResult: searchResult
})

export const setSupplierSearchTerm = searchTerm => ({
  type: ACTION_SET_SUPPLIER_SEARCH_TERM,
  supplierSearchTerm: searchTerm
})

export const searchSupplier = searchTerm => dispatch => {
  dispatch(sendingRequest(true))
  dmapi({
    url: '/search/suppliers',
    params: {
      supplier_name_prefix: searchTerm
    }
  }).then(response => {
    if (response.error) {
      dispatch(setErrorMessage(GENERAL_ERROR))
    } else {
      dispatch(setSupplierSearchResult(response.data))
    }

    dispatch(sendingRequest(false))
  })
}
=======
export function loadUsers(searchString) {
  return dispatch => {
    dispatch(sendingRequest(true))
    console.log('!!!!!!!!!!!!!!!!!!', searchString)
    dmapi({
      method: 'get',
      url: `/users?string=${searchString}`
    }).then(response => {
      if (response.error) {
        dispatch(setErrorMessage(GENERAL_ERROR))
      } else {
        dispatch(setUserTableData(response.data))
        window.scrollTo(0, 0)
        // dispatch(setTableFocus(true))
      }
      dispatch(sendingRequest(false))
    })
  }
}

export function loadSomethingElse() {}
>>>>>>> Added actions and reducers for admin search
