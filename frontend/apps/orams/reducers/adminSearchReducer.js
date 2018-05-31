<<<<<<< HEAD
import {
  ACTION_SET_SUPPLIER_SEARCH,
  ACTION_SET_SUPPLIER_SEARCH_TERM,
  ACTION_SET_USER_SEARCH,
  ADMIN_SEARCH_TYPE_SUPPLIER,
  ADMIN_SEARCH_TYPE_USER
} from 'orams/constants/constants'

const initialState = {
  searchType: '',
  supplierSearchResult: [],
  userSearchResult: [],
  currentlySending: false,
  errorMessage: null
}

const adminSearchReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTION_SET_SUPPLIER_SEARCH:
      return {
        ...state,
        searchType: ADMIN_SEARCH_TYPE_SUPPLIER,
        supplierSearchResult: action.supplierSearchResult,
        userSearchResult: [],
        userSearchTerm: ''
      }

    case ACTION_SET_SUPPLIER_SEARCH_TERM:
      return {
        ...state,
        searchType: ADMIN_SEARCH_TYPE_SUPPLIER,
        supplierSearchTerm: action.supplierSearchTerm
      }

    case ACTION_SET_USER_SEARCH:
      return {
        ...state,
        searchType: ADMIN_SEARCH_TYPE_USER,
        supplierSearchResult: [],
        supplierSearchTerm: '',
        userSearchResult: action.userSearchResult
=======
import { SET_USER_TABLE_DATA, SET_TABLE_FOCUS } from 'orams/constants/constants'

const defaultAdminSearchState = {
  usersData: [],
  suppliersData: [],
  tableFocus: false
}

const adminSearchReducer = (state = defaultAdminSearchState, action) => {
  switch (action.type) {
    case SET_USER_TABLE_DATA:
      return {
        ...state,
        userTableData: action.userTableData
      }

    case SET_TABLE_FOCUS:
      return {
        ...state,
        tableFocus: action.tableFocus
>>>>>>> Added actions and reducers for admin search
      }

    default:
      return state
  }
}

export default adminSearchReducer
