import { SET_REFERRAL_DATA } from 'orams/constants/constants'

const initialState = {
  supplier: '',
  price: '',
  dateCreated: '',
  regionName: '',
  regionState: '',
  createdBy: '',
  referralId: '',
  agency: ''
}

const referralDetailsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_REFERRAL_DATA:
      return { ...state, ...action.referralData }
    default:
      return state
  }
}

export default referralDetailsReducer
