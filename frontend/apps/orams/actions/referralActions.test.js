import dmapi from 'orams/services/apiClient'
import { GENERAL_ERROR, UNAUTHORISED_ERROR } from 'orams/constants/messageConstants'
import { SET_REFERRAL_DATA, SET_ERROR_MESSAGE } from '../constants/constants'
import { loadReferralData } from './referralActions'

jest.mock('orams/services/apiClient')

describe('referralActions', () => {
  const mockDispatch = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should GET from correct path', () => {
    const responseData = { data: { price: 200 } }

    dmapi.mockReturnValueOnce(Promise.resolve(responseData))
    loadReferralData(321)(mockDispatch)
    expect(dmapi.mock.calls[0][0]).toEqual({ url: 'referral/321' })
  })

  it('should set referral data to state from response', () => {
    const responseData = { data: { price: 200 } }
    const expectedAction = { type: SET_REFERRAL_DATA, referralData: { price: 200 } }
    dmapi.mockReturnValueOnce(Promise.resolve(responseData))
    return loadReferralData(1)(mockDispatch).then(() => {
      expect(mockDispatch.mock.calls[0][0]).toEqual(expectedAction)
    })
  })

  it('should set general error message', () => {
    const responseData = { error: { message: 'some error' } }
    const expectedAction = { type: SET_ERROR_MESSAGE, errorMessage: GENERAL_ERROR }
    dmapi.mockReturnValueOnce(Promise.resolve(responseData))
    return loadReferralData(1)(mockDispatch).then(() => {
      expect(mockDispatch.mock.calls[0][0]).toEqual(expectedAction)
    })
  })

  it('should set unauthorised error message', () => {
    const responseData = { error: 'some error', status: 401 }
    const expectedAction = { type: SET_ERROR_MESSAGE, errorMessage: UNAUTHORISED_ERROR }
    dmapi.mockReturnValueOnce(Promise.resolve(responseData))
    return loadReferralData(1)(mockDispatch).then(() => {
      expect(mockDispatch.mock.calls[0][0]).toEqual(expectedAction)
    })
  })
})
