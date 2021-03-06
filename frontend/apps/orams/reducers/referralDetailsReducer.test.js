import { SET_REFERRAL_DATA, SET_LOADING_REFERRAL_DATA, RESET_LOADING_REFERRAL_DATA } from 'orams/constants/constants'
import referralDetailsReducer from './referralDetailsReducer'

describe.only('referralDetailsReducer', () => {
  it('should initialize with empty string for each fields', () => {
    expect(referralDetailsReducer(undefined, {})).toEqual({
      supplier: '',
      price: '',
      dateCreated: '',
      regionName: '',
      regionState: '',
      createdBy: '',
      referralId: '',
      agency: '',
      isLoading: false
    })
  })

  it('should set loading flag', () => {
    expect(referralDetailsReducer({ isLoading: false }, { type: SET_LOADING_REFERRAL_DATA })).toEqual({
      isLoading: true
    })
  })

  it('should reset loading flag', () => {
    expect(referralDetailsReducer({ isLoading: true }, { type: RESET_LOADING_REFERRAL_DATA })).toEqual({
      isLoading: false
    })
  })

  it('should set referral data', () => {
    // init state
    const state = referralDetailsReducer(undefined, {})
    const data = {
      supplier: 'ABC Rehabilitation',
      price: 123.09,
      dateCreated: '',
      regionName: 'East',
      regionState: 'NSW',
      createdBy: 'David Brown',
      referralId: 234,
      agency: 'agency name',
      isLoading: false
    }
    expect(referralDetailsReducer(state, { type: SET_REFERRAL_DATA, referralData: data })).toEqual(data)
  })
})
