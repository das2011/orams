import { SET_REFERRAL_DATA } from 'orams/constants/constants'
import referralDetailsReducer from './referralDetailsReducer'

describe('referralDetailsReducer', () => {
  it('should initialize with empty string for each fields', () => {
    expect(referralDetailsReducer(undefined, {})).toEqual({
      supplier: '',
      price: '',
      dateCreated: '',
      regionName: '',
      regionState: '',
      createdBy: '',
      referralId: '',
      agency: ''
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
      agency: 'agency name'
    }
    expect(referralDetailsReducer(state, { type: SET_REFERRAL_DATA, referralData: data })).toEqual(data)
  })
})
