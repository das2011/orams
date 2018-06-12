import dmapi from 'orams/services/apiClient'
import {
  SENDING_REQUEST,
  SET_CEILING_PRICE_TO_EDIT_ID,
  SET_PRICE_TO_EDIT_DATA,
  SET_SUPPLIER_CODE,
  SET_STEP,
  SET_SUCCESS_MESSAGE
} from 'orams/constants/constants'
import { setCeilingPricetoEditId, setSupplierCode, setCeilingPriceToEdit, updateCeilingPrice } from './editPriceActions'

jest.mock('orams/services/apiClient')

describe('editPriceActions', () => {
  test('correct cap price id is set when setCeilingPriceToEditId is called', () => {
    const capPriceId = 1

    expect(setCeilingPricetoEditId(1)).toMatchObject({
      type: SET_CEILING_PRICE_TO_EDIT_ID,
      capPriceId
    })
  })

  test('correct supplier code is set when setSupplierCode is called', () => {
    const supplierCode = 10

    expect(setSupplierCode(10)).toMatchObject({
      type: SET_SUPPLIER_CODE,
      supplierCode
    })
  })

  describe('setCeilingPriceToEdit', () => {
    const priceToEdit = {
      capPrice: '1000',
      capPriceId: 1,
      price: '500',
      region: {
        name: 'Metro',
        state: 'NSW'
      },
      startDate: '01/01/2018',
      endDate: '31/12/3999'
    }

    const mockDispatch = jest.fn()
    setCeilingPriceToEdit(priceToEdit)(mockDispatch)

    test('dispatch setCeilingPriceToEditId to have been called with capPriceId', () => {
      const [setPriceToEditIdDispatch] = mockDispatch.mock.calls
      const [dispatchArg] = setPriceToEditIdDispatch

      expect(dispatchArg).toMatchObject({
        type: SET_CEILING_PRICE_TO_EDIT_ID,
        capPriceId: priceToEdit.capPriceId
      })
    })

    test('dispatch setPriceToEdit to have been called with priceData', () => {
      const [, setPriceToEditDispatch] = mockDispatch.mock.calls
      const [dispatchArg] = setPriceToEditDispatch

      expect(dispatchArg).toMatchObject({
        type: SET_PRICE_TO_EDIT_DATA,
        priceData: priceToEdit
      })
    })

    test('dispatch setStep to have been called with step 3', () => {
      const [, , setStepDispatch] = mockDispatch.mock.calls
      const [dispatchArg] = setStepDispatch

      expect(dispatchArg).toMatchObject({
        type: SET_STEP,
        step: 3
      })
    })
  })

  describe('updateCeilingPrice', () => {
    const getState = () => ({
      editPricing: {
        supplierCode: 100,
        serviceToEdit: {
          serviceTypeId: 9999,
          categoryId: 2000,
          serviceName: 'Service Name',
          subCategoryName: 'Sub Category Name'
        }
      }
    })
    const capPriceId = 1
    const requestData = {
      ceilingPrice: 1000,
      setCurrentPriceToCeiling: true
    }
    const updateCeilingPriceResponse = { data: {} }
    const loadPricesDataResponse = { data: {} }

    beforeEach(() => {
      jest.resetAllMocks()

      dmapi
        .mockReturnValueOnce(Promise.resolve(updateCeilingPriceResponse))
        .mockReturnValueOnce(Promise.resolve(loadPricesDataResponse))
    })

    test('should POST to correct path', () => {
      const mockDispatch = jest.fn()
      updateCeilingPrice(requestData, capPriceId)(mockDispatch, getState)

      const [dmapiFunctionCall] = dmapi.mock.calls
      const [dmapiArg] = dmapiFunctionCall

      expect(dmapiArg).toMatchObject({
        method: 'post',
        url: `/ceiling-prices/${capPriceId}`,
        data: JSON.stringify(requestData)
      })
    })

    test('should dispatch a SENDING REQUEST true on success', () => {
      const mockDispatch = jest.fn()

      return updateCeilingPrice(requestData, capPriceId)(mockDispatch, getState).then(() => {
        const [sendingRequestDispatch] = mockDispatch.mock.calls
        const [dispatchArg] = sendingRequestDispatch

        expect(dispatchArg).toMatchObject({
          type: SENDING_REQUEST,
          sending: true
        })
      })
    })

    test('should dispatch a Success message true on success', () => {
      const mockDispatch = jest.fn()

      return updateCeilingPrice(requestData, capPriceId)(mockDispatch, getState).then(() => {
        const [, successMessageDispatch] = mockDispatch.mock.calls
        const [dispatchArg] = successMessageDispatch

        expect(dispatchArg).toMatchObject({
          type: SET_SUCCESS_MESSAGE,
          successMessage: true
        })
      })
    })

    test('should dispatch a reset of editCeilingPriceForm on success', () => {
      const mockDispatch = jest.fn()

      return updateCeilingPrice(requestData, capPriceId)(mockDispatch, getState).then(() => {
        const [, , resetFormDispatch] = mockDispatch.mock.calls
        const [dispatchArg] = resetFormDispatch

        expect(dispatchArg).toMatchObject({
          type: 'rrf/reset',
          model: 'editCeilingPriceForm'
        })
      })
    })
  })
})
