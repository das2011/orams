import dmapi from 'orams/services/apiClient'
import { GENERAL_ERROR, UNAUTHORISED_ERROR } from 'orams/constants/messageConstants'
import { getMockCallArg } from 'orams/test-utils/mockUtils'
import {
  SET_REFERRAL_DATA,
  SET_ERROR_MESSAGE,
  SET_LOADING_REFERRAL_DATA,
  RESET_LOADING_REFERRAL_DATA
} from '../constants/constants'
import { loadReferralData } from './referralActions'

jest.mock('orams/services/apiClient')

describe('referralActions', () => {
  const mockDispatch = jest.fn()
  const setLoadingAction = { type: SET_LOADING_REFERRAL_DATA }
  const resetLoadingAction = { type: RESET_LOADING_REFERRAL_DATA }

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should GET from correct path', () => {
    const responseData = { data: { price: 200 } }

    dmapi.mockReturnValueOnce(Promise.resolve(responseData))
    loadReferralData(321)(mockDispatch)
    const apiClientCallArg = getMockCallArg(dmapi, 0, 0)
    expect(apiClientCallArg).toEqual({ url: 'referrals/321' })
  })

  it('should set referral data to state from response', () => {
    const responseData = { data: { price: 200 } }
    const setReferralAction = { type: SET_REFERRAL_DATA, referralData: { price: 200 } }
    dmapi.mockReturnValueOnce(Promise.resolve(responseData))

    return loadReferralData(1)(mockDispatch).then(() => {
      const firstCallFirstArg = getMockCallArg(mockDispatch, 0, 0)
      const secondCallFirstArg = getMockCallArg(mockDispatch, 1, 0)
      const thirdCallFirstArg = getMockCallArg(mockDispatch, 2, 0)

      expect(firstCallFirstArg).toEqual(setLoadingAction)
      expect(secondCallFirstArg).toEqual(resetLoadingAction)
      expect(thirdCallFirstArg).toEqual(setReferralAction)
    })
  })

  it('should set general error message', () => {
    const responseData = { error: { message: 'some error' } }
    const expectedErrorAction = { type: SET_ERROR_MESSAGE, errorMessage: GENERAL_ERROR }
    dmapi.mockReturnValueOnce(Promise.resolve(responseData))

    return loadReferralData(1)(mockDispatch).then(() => {
      const firstCallFirstArg = getMockCallArg(mockDispatch, 0, 0)
      const secondCallFirstArg = getMockCallArg(mockDispatch, 1, 0)
      const thirdCallFirstArg = getMockCallArg(mockDispatch, 2, 0)

      expect(firstCallFirstArg).toEqual(setLoadingAction)
      expect(secondCallFirstArg).toEqual(resetLoadingAction)
      expect(thirdCallFirstArg).toEqual(expectedErrorAction)
    })
  })

  it('should set unauthorised error message', () => {
    const responseData = { error: 'some error', status: 403 }
    const expectedErrorAction = { type: SET_ERROR_MESSAGE, errorMessage: UNAUTHORISED_ERROR }
    dmapi.mockReturnValueOnce(Promise.resolve(responseData))
    return loadReferralData(1)(mockDispatch).then(() => {
      const firstCallFirstArg = getMockCallArg(mockDispatch, 0, 0)
      const secondCallFirstArg = getMockCallArg(mockDispatch, 1, 0)
      const thirdCallFirstArg = getMockCallArg(mockDispatch, 2, 0)

      expect(firstCallFirstArg).toEqual(setLoadingAction)
      expect(secondCallFirstArg).toEqual(resetLoadingAction)
      expect(thirdCallFirstArg).toEqual(expectedErrorAction)
    })
  })
})
