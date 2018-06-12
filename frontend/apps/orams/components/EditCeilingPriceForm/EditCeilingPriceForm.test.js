import React from 'react'
import Enzyme, { mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import expect from 'expect'
import { Provider } from 'react-redux'
import snapshotRenderer from 'react-test-renderer'
import configureStore from 'orams/store/store.prod.js' // dont want the debugger
import EditCeilingPriceForm from './EditCeilingPriceForm'

Enzyme.configure({ adapter: new Adapter() })

describe('#EditCeilingPriceForm', () => {
  const gotoStepSpy = jest.fn()
  const handlePriceSubmitSpy = jest.fn()
  const props = {
    supplier: {
      name: 'Supplier Name'
    },
    priceData: {
      capPrice: '1000',
      capPriceId: 1,
      price: '500',
      region: {
        name: 'Metro',
        state: 'NSW'
      }
    },
    serviceToEdit: {
      serviceName: 'Service To Edit'
    },
    goToStep: gotoStepSpy
  }

  const store = configureStore()

  test('renders with pricing details', () => {
    const tree = snapshotRenderer
      .create(
        <Provider store={store}>
          <EditCeilingPriceForm {...props} handlePriceSubmit={handlePriceSubmitSpy} />
        </Provider>
      )
      .toJSON()

    expect(tree).toMatchSnapshot()
  })

  test('goToStep() is called with correct parameters', () => {
    const wrapper = mount(
      <Provider store={store}>
        <EditCeilingPriceForm {...props} handlePriceSubmit={handlePriceSubmitSpy} />
      </Provider>
    )

    wrapper.find('.backLink').simulate('click')

    expect(gotoStepSpy).toBeCalledWith(2)
  })

  test('error validation when new cap price is less than current price', () => {
    const wrapper = mount(
      <Provider store={store}>
        <EditCeilingPriceForm {...props} handlePriceSubmit={handlePriceSubmitSpy} />
      </Provider>
    )

    const ceilingPriceInput = wrapper.find('input[type="text"]')
    ceilingPriceInput.simulate('change', { target: { value: '100' } })
    ceilingPriceInput.simulate('blur')

    const validationMessageElement = wrapper.find('.validation-message')

    expect(validationMessageElement.length).toBe(1)
  })

  describe('handlePriceSubmit()', () => {
    test('called with correct parameters when set current price to match is checked', () => {
      const checkedHandlePriceSubmitSpy = jest.fn()
      const expectedPriceData = props.priceData
      const wrapper = mount(
        <Provider store={store}>
          <EditCeilingPriceForm {...props} handlePriceSubmit={checkedHandlePriceSubmitSpy} />
        </Provider>
      )

      wrapper.find('input.match-ceiling-price__checkbox').simulate('change', { target: { checked: true } })
      wrapper.find('.au-btn').simulate('submit')

      expect(checkedHandlePriceSubmitSpy).toBeCalledWith(
        {
          ceilingPrice: expectedPriceData.capPrice,
          setCurrentPriceToCeiling: true
        },
        expectedPriceData.capPriceId
      )
    })

    test('called with correct parameters when set current price to match is not checked', () => {
      const uncheckedHandlePriceSubmitSpy = jest.fn()
      const expectedPriceData = props.priceData
      const wrapper = mount(
        <Provider store={store}>
          <EditCeilingPriceForm {...props} handlePriceSubmit={uncheckedHandlePriceSubmitSpy} />
        </Provider>
      )

      wrapper.find('input.match-ceiling-price__checkbox').simulate('change', { target: { checked: false } })
      wrapper.find('.au-btn').simulate('submit')

      expect(uncheckedHandlePriceSubmitSpy).toBeCalledWith(
        {
          ceilingPrice: expectedPriceData.capPrice,
          setCurrentPriceToCeiling: false
        },
        expectedPriceData.capPriceId
      )
    })
  })
})
