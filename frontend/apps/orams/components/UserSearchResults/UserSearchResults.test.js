import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import expect from 'expect'
import UserSearchResults from './UserSearchResults'

Enzyme.configure({ adapter: new Adapter() })

describe('UserSearchResults', () => {
  describe('when search results does not exist', () => {
    test('renders no results message', () => {
      const wrapper = shallow(<UserSearchResults />)

      expect(wrapper.find('AUpageAlert')).toBeTruthy()
    })
  })

  describe('when searchResults exists', () => {
    const expectedSuppliers = [
      {
        id: 1,
        name: 'Buyer user',
        role: 'buyer',
        email_address: 'buyer@orams.com'
      },
      {
        id: 2,
        name: 'Seller user',
        role: 'seller',
        email_address: 'seller@orams.com'
      }
    ]

    test('there are 2 supplier rows rendered', () => {
      const wrapper = shallow(<UserSearchResults searchResults={expectedSuppliers} />)
      const displayedSupplierRows = wrapper.find('.user')

      expect(displayedSupplierRows.length).toBe(2)
    })

    test('renders the names correctly', () => {
      const wrapper = shallow(<UserSearchResults searchResults={expectedSuppliers} />)
      expect(wrapper).toMatchSnapshot()
    })
  })
})
