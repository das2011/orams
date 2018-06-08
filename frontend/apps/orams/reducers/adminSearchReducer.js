import {
  SET_SUPPLIER_SEARCH,
  SET_USER_SEARCH,
  ADMIN_SEARCH_TYPE_SUPPLIER,
  ADMIN_SEARCH_TYPE_USER,
  SET_USER_PROFILE_DATA,
  SET_ADMIN_UPDATE_USER_SUCCESS,
  SET_ADMIN_UPDATE_USER_ERROR
} from 'orams/constants/constants'

const initialState = {
  searchType: '',
  supplierSearchResult: [],
  userSearchResult: [],
  currentlySending: false,
  errorMessage: null,
  updateUserSuccessMessage: null,
  updateUserErrorMessage: null
}

const adminSearchReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SUPPLIER_SEARCH:
      return {
        ...state,
        searchType: ADMIN_SEARCH_TYPE_SUPPLIER,
        supplierSearchResult: action.supplierSearchResult,
        updateUserSuccessMessage: null,
        updateUserErrorMessage: null
      }

    case SET_USER_SEARCH:
      return {
        ...state,
        searchType: ADMIN_SEARCH_TYPE_USER,
        userSearchResult: action.userSearchResult,
        updateUserSuccessMessage: null,
        updateUserErrorMessage: null
      }

    case SET_USER_PROFILE_DATA:
      return {
        ...state,
        userProfileData: action.userProfileData
      }

    case SET_ADMIN_UPDATE_USER_ERROR:
      return {
        ...state,
        errorMessage: null,
        updateUserErrorMessage: action.errorMessage,
        updateUserSuccessMessage: null
      }

    case SET_ADMIN_UPDATE_USER_SUCCESS:
      return {
        ...state,
        errorMessage: null,
        updateUserErrorMessage: null,
        updateUserSuccessMessage: action.successMessage
      }

    default:
      return state
  }
}

export default adminSearchReducer
