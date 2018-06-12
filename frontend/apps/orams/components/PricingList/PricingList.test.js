import React from 'react'
import Enzyme, { mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import expect from 'expect'
import snapshotRenderer from 'react-test-renderer'
import PricingList from './PricingList'

Enzyme.configure({ adapter: new Adapter() })

describe('#PricingList', () => {
  const gotoStepSpy = jest.fn()
  const defaultProps = {
    supplier: {
      name: 'Supplier Name'
    },
    serviceToEdit: {
      serviceName: 'Service To Edit',
      subCategoryName: 'Sub Category'
    },
    pricesData: {
      prices: [
        {
          capPrice: '1000',
          capPriceId: 1,
          price: '500',
          region: {
            name: 'Metro',
            state: 'NSW'
          },
          startDate: '01/01/2018',
          endDate: '31/12/3999'
        },
        {
          capPrice: '2000',
          capPriceId: 2,
          price: '1000',
          region: {
            name: 'Metro',
            state: 'NSW'
          },
          startDate: '01/01/2018',
          endDate: '31/12/3999'
        }
      ]
    },
    hideNav: jest.fn(),
    goToStep: gotoStepSpy,
    editPrice: jest.fn()
  }

  test('renders correct header when it is update ceiling price', () => {
    const isCeilingPriceUpdate = true
    const props = {
      ...defaultProps,
      isCeilingPriceUpdate
    }
    const tree = snapshotRenderer.create(<PricingList {...props} />).toJSON()

    expect(tree).toMatchSnapshot()
  })

  test('renders correct header when it is not update ceiling price', () => {
    const isCeilingPriceUpdate = false
    const props = {
      ...defaultProps,
      isCeilingPriceUpdate
    }
    const tree = snapshotRenderer.create(<PricingList {...props} />).toJSON()

    expect(tree).toMatchSnapshot()
  })

  test('renders success message', () => {
    const isCeilingPriceUpdate = true
    const props = {
      ...defaultProps,
      isCeilingPriceUpdate,
      successMessage: 'Success'
    }
    const tree = snapshotRenderer.create(<PricingList {...props} />).toJSON()

    expect(tree).toMatchSnapshot()
  })

  test('goToStep() is called with correct parameters', () => {
    const isCeilingPriceUpdate = true
    const props = {
      ...defaultProps,
      isCeilingPriceUpdate
    }
    const wrapper = mount(<PricingList {...props} />)

    wrapper.find('.backLink').simulate('click')

    expect(gotoStepSpy).toBeCalledWith(1)
  })

  test('editPrice() is called with correct parameters', () => {
    const editPriceSpy = jest.fn()
    const isCeilingPriceUpdate = true
    const props = {
      ...defaultProps,
      isCeilingPriceUpdate,
      editPrice: editPriceSpy
    }
    const wrapper = mount(<PricingList {...props} />)

    const priceRow = wrapper.find('.priceRow .link').first()
    priceRow.simulate('click')

    expect(editPriceSpy).toBeCalledWith(defaultProps.pricesData.prices[0])
  })
})
