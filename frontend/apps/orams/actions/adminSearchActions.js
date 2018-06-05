import {
  ACTION_SET_SUPPLIER_SEARCH,
  ACTION_SET_SUPPLIER_SEARCH_TERM,
  ACTION_SET_USER_SEARCH,
  ACTION_SET_USER_SEARCH_TERM,
  SET_USER_PROFILE_DATA,
  SENDING_REQUEST,
  SET_ERROR_MESSAGE
} from 'orams/constants/constants'
import { GENERAL_ERROR } from 'orams/constants/messageConstants'
import dmapi from 'orams/services/apiClient'

export const sendingRequest = sending => ({ type: SENDING_REQUEST, sending })

const setErrorMessage = errorMessage => ({
  type: SET_ERROR_MESSAGE,
  errorMessage
})

const setSupplierSearchResult = searchResult => ({
  type: ACTION_SET_SUPPLIER_SEARCH,
  supplierSearchResult: searchResult
})

export const setSupplierSearchTerm = searchTerm => ({
  type: ACTION_SET_SUPPLIER_SEARCH_TERM,
  supplierSearchTerm: searchTerm
})

const setUserSearchResult = searchResult => ({
  type: ACTION_SET_USER_SEARCH,
  userSearchResult: searchResult
})

export const setUserSearchTerm = searchTerm => ({
  type: ACTION_SET_USER_SEARCH_TERM,
  userSearchTerm: searchTerm
})

export const setUserProfileData = userProfileData => ({
  type: SET_USER_PROFILE_DATA,
  userProfileData
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

export const searchUser = searchTerm => dispatch => {
  dispatch(sendingRequest(true))
  dmapi({
    method: 'get',
    url: `/users?string=${searchTerm}`
  }).then(response => {
    if (response.error) {
      dispatch(setErrorMessage(GENERAL_ERROR))
    } else {
      dispatch(setUserSearchResult(response.data))
    }

    dispatch(sendingRequest(false))
  })
}

export const loadUserProfileData = id => dispatch => {
  dispatch(sendingRequest(true))
  dmapi({
    method: 'get',
    url: `/users/${id}`
  }).then(response => {
    if (response.error) {
      dispatch(setErrorMessage(GENERAL_ERROR))
    } else {
      dispatch(setUserProfileData(response.data))
    }
    dispatch(sendingRequest(false))
  })
}
