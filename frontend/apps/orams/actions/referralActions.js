import { SENDING_REQUEST, SET_ERROR_MESSAGE, SET_REFERRAL_DATA } from 'orams/constants/constants'
import { GENERAL_ERROR, UNAUTHORISED_ERROR } from 'orams/constants/messageConstants'
import dmapi from 'orams/services/apiClient'
import { setSuccessMessage } from './editPriceActions'

const sendingRequest = sending => ({ type: SENDING_REQUEST, sending })

const setErrorMessage = errorMessage => ({
  type: SET_ERROR_MESSAGE,
  errorMessage
})

const setReferralData = referralData => ({ type: SET_REFERRAL_DATA, referralData })

export const createReferral = data => dispatch => { //eslint-disable-line
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
  return dispatch =>
    dmapi({ url: `referral/${id}` }).then(response => {
      if (response.error) {
        if (response.status === 401) {
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
