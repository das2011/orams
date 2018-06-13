import {
  SET_REFERRAL_DATA,
  SET_REFERRAL_INFO_DATA,
  SET_REFERRAL_FORM_DATA,
  SET_LOADING_REFERRAL_DATA,
  RESET_LOADING_REFERRAL_DATA
} from 'orams/constants/constants'

const initialState = {
  referralInfoData: '',
  supplier: '',
  price: '',
  dateCreated: '',
  regionName: '',
  regionState: '',
  createdBy: '',
  referralId: '',
  agency: '',
  isLoading: false
}

const referralDetailsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_REFERRAL_DATA:
      return { ...state, ...action.referralData }
    case SET_REFERRAL_INFO_DATA:
      return { ...state, referralInfoData: action.referralInfoData }
    case SET_REFERRAL_FORM_DATA:
      return { ...state, ...action.referralFormData }
    case SET_LOADING_REFERRAL_DATA:
      return { ...state, isLoading: true }
    case RESET_LOADING_REFERRAL_DATA:
      return { ...state, isLoading: false }
    default:
      return state
  }
}

export default referralDetailsReducer
