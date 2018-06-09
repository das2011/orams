import { actions } from 'react-redux-form'
import {
  SET_SUPPLIER_SEARCH,
  SET_SUPPLIER_SEARCH_TERM,
  SET_USER_SEARCH,
  SET_USER_SEARCH_TERM,
  SET_USER_PROFILE_DATA,
  SENDING_REQUEST,
  SET_ERROR_MESSAGE,
  SET_ADMIN_UPDATE_USER_ERROR,
  SET_ADMIN_UPDATE_USER_SUCCESS
} from 'orams/constants/constants'
import {
  GENERAL_ERROR,
  DEACTIVATE_USER_ERROR,
  DEACTIVATE_USER_SUCCESS,
  ACTIVATE_USER_ERROR,
  ACTIVATE_USER_SUCCESS,
  UNLOCK_USER_ERROR,
  UNLOCK_USER_SUCCESS
} from 'orams/constants/messageConstants'
import dmapi from 'orams/services/apiClient'

export const sendingRequest = sending => ({ type: SENDING_REQUEST, sending })

const setErrorMessage = errorMessage => ({
  type: SET_ERROR_MESSAGE,
  errorMessage
})

export const setUserUpdateErrorMessage = errorMessage => ({
  type: SET_ADMIN_UPDATE_USER_ERROR,
  errorMessage
})

export const setUserUpdateSuccessMessage = successMessage => ({
  type: SET_ADMIN_UPDATE_USER_SUCCESS,
  successMessage
})

const setSupplierSearchResult = searchResult => ({
  type: SET_SUPPLIER_SEARCH,
  supplierSearchResult: searchResult
})

export const setSupplierSearchTerm = searchTerm => ({
  type: SET_SUPPLIER_SEARCH_TERM,
  supplierSearchTerm: searchTerm
})

const setUserSearchResult = searchResult => ({
  type: SET_USER_SEARCH,
  userSearchResult: searchResult
})

export const setUserSearchTerm = searchTerm => ({
  type: SET_USER_SEARCH_TERM,
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
      dispatch(actions.reset('userSearchForm'))
      dispatch(setSupplierSearchResult(response.data))
    }

    dispatch(sendingRequest(false))
  })
}

export const searchUser = searchTerm => dispatch => {
  dispatch(sendingRequest(true))
  return dmapi({
    method: 'get',
    url: `/users?string=${searchTerm}`
  }).then(response => {
    if (response.error) {
      dispatch(setErrorMessage(GENERAL_ERROR))
    } else {
      dispatch(actions.reset('supplierSearchForm'))
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

const updateUser = (url, errorMessage, successMessage) => dispatch => {
  dispatch(sendingRequest(true))
  dmapi({
    method: 'put',
    url
  }).then(response => {
    if (response.error) {
      dispatch(setUserUpdateErrorMessage(errorMessage))
    } else {
      dispatch(setUserProfileData(response.data))
      dispatch(setUserUpdateSuccessMessage(successMessage))
    }
    dispatch(sendingRequest(false))
  })
}

export const deactivateUser = id => dispatch => {
  const url = `/users/${id}/deactivate`
  dispatch(updateUser(url, DEACTIVATE_USER_ERROR, DEACTIVATE_USER_SUCCESS))
}

export const activateUser = id => dispatch => {
  const url = `/users/${id}/activate`
  dispatch(updateUser(url, ACTIVATE_USER_ERROR, ACTIVATE_USER_SUCCESS))
}

export const unlockUser = id => dispatch => {
  const url = `/users/${id}/unlock`
  dispatch(updateUser(url, UNLOCK_USER_ERROR, UNLOCK_USER_SUCCESS))
}
