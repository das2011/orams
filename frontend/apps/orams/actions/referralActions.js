import { GENERAL_ERROR, UNAUTHORISED_ERROR } from 'orams/constants/messageConstants'
import dmapi from 'orams/services/apiClient'
import { setSuccessMessage } from './editPriceActions'
import {
  SENDING_REQUEST,
  SET_ERROR_MESSAGE,
  SET_REFERRAL_DATA,
  SET_REFERRAL_INFO_DATA,
  SET_REFERRAL_FORM_DATA,
  SET_LOADING_REFERRAL_DATA,
  RESET_LOADING_REFERRAL_DATA
} from '../constants/constants'

const sendingRequest = sending => ({ type: SENDING_REQUEST, sending })

const setErrorMessage = errorMessage => ({
  type: SET_ERROR_MESSAGE,
  errorMessage
})

const setLoading = () => ({ type: SET_LOADING_REFERRAL_DATA })
const resetLoading = () => ({ type: RESET_LOADING_REFERRAL_DATA })
const setReferralData = referralData => ({ type: SET_REFERRAL_DATA, referralData })
const setReferralFormData = referralFormData => ({ type: SET_REFERRAL_FORM_DATA, referralFormData })
const setReferralInfoData = referralInfoData => ({ type: SET_REFERRAL_INFO_DATA, referralInfoData })

export const saveReferralBuilder1FormData = data => dispatch => {
  dispatch(setReferralFormData(data))
}

export const createReferral = data => dispatch => {
  dispatch(sendingRequest(true))
  dmapi({
    method: 'post',
    url: '/referrals',
    data: JSON.stringify(data)
  }).then(response => {
    if (response.error) {
      dispatch(setErrorMessage(GENERAL_ERROR))
    } else {
      dispatch(setSuccessMessage(true))
      // todo need to do something here with the response.data.id
    }
    dispatch(sendingRequest(false))
  })
}

export function loadReferralData(id) {
  return dispatch => {
    dispatch(setLoading())
    return dmapi({ url: `referrals/${id}` }).then(response => {
      dispatch(resetLoading())
      if (response.error) {
        if (response.status === 403) {
          dispatch(setErrorMessage(UNAUTHORISED_ERROR))
        } else {
          dispatch(setErrorMessage(GENERAL_ERROR))
        }
      } else {
        dispatch(setReferralData(response.data))
        window.scrollTo(0, 0)
      }
    })
  }
}

export function loadReferralInfoByPriceId(id) {
  return dispatch => {
    dispatch(sendingRequest(true))
    return dmapi({
      method: 'get',
      url: `/prices/${id}`
    }).then(response => {
      if (response.error) {
        dispatch(setErrorMessage(GENERAL_ERROR))
      } else {
        dispatch(setReferralInfoData(response.data))
      }
      dispatch(sendingRequest(false))
    })
  }
}
