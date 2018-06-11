import React from 'react'
import Enzyme, { mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import expect from 'expect'
import snapshotRenderer from 'react-test-renderer'
import ServiceEditList from './ServiceEditList'

Enzyme.configure({ adapter: new Adapter() })

describe('#ServiceEditList', () => {
  const goBackSpy = jest.fn()
  const defaultProps = {
    history: {
      goBack: goBackSpy
    },
    hideNav: jest.fn(),
    supplierCode: 1,
    supplier: {
      name: 'Supplier Name'
    },
    editServiceData: {
      services: [
        {
          id: 1,
          name: 'Componensation Service',
          subCategories: [
            {
              id: 1,
              name: 'Physical'
            }
          ]
        },
        {
          id: 2,
          name: 'Rehabiliation Service',
          subCategories: [
            {
              id: 1,
              name: 'Physical'
            },
            {
              id: 1,
              name: 'Psychological'
            }
          ]
        }
      ]
    }
  }

  test('renders correct header when it is update ceiling price', () => {
    const isCeilingPriceUpdate = true
    const props = {
      ...defaultProps,
      isCeilingPriceUpdate,
      linkClick: jest.fn()
    }
    const tree = snapshotRenderer.create(<ServiceEditList {...props} />).toJSON()

    expect(tree).toMatchSnapshot()
  })

  test('renders correct header when it is not update ceiling price', () => {
    const isCeilingPriceUpdate = false
    const props = {
      ...defaultProps,
      isCeilingPriceUpdate,
      linkClick: jest.fn()
    }
    const tree = snapshotRenderer.create(<ServiceEditList {...props} />).toJSON()

    expect(tree).toMatchSnapshot()
  })

  test('renders success message', () => {
    const isCeilingPriceUpdate = true
    const props = {
      ...defaultProps,
      isCeilingPriceUpdate,
      successMessage: 'Success',
      linkClick: jest.fn()
    }
    const tree = snapshotRenderer.create(<ServiceEditList {...props} />).toJSON()

    expect(tree).toMatchSnapshot()
  })

  test('link is clicked with correct params when selecting a service to edit', () => {
    const isCeilingPriceUpdate = true
    const linkClickSpy = jest.fn()
    const props = {
      ...defaultProps,
      isCeilingPriceUpdate,
      linkClick: linkClickSpy
    }
    const { supplierCode, editServiceData: { services } } = props
    const [compensationService] = services
    const { id: serviceId, name: serviceName, subCategories: [phsysicalCategory] } = compensationService

    const wrapper = mount(<ServiceEditList {...props} />)

    const serviceLink = wrapper.find('.link-service').first()
    serviceLink.simulate('click')

    expect(linkClickSpy).toBeCalledWith(
      supplierCode,
      serviceId,
      phsysicalCategory.id,
      serviceName,
      phsysicalCategory.name
    )
  })
})
