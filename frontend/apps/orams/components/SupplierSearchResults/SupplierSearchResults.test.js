import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import expect from 'expect'
import snapshotRenderer from 'react-test-renderer'
import SupplierSearchResults from './SupplierSearchResults'

Enzyme.configure({ adapter: new Adapter() })

describe('SupplierSearchResults', () => {
  describe('when search results does not exist', () => {
    test('renders no results message', () => {
      const wrapper = shallow(<SupplierSearchResults />)

      expect(wrapper.find('AUpageAlert')).toBeTruthy()
    })
  })

  describe('when searchResults exists', () => {
    const expectedSuppliers = [
      {
        id: 1,
        name: 'Test Supplier'
      },
      {
        id: 2,
        name: 'Another Supplier'
      }
    ]
    const searchResults = { suppliers: expectedSuppliers }

    test('there are 2 supplier rows rendered', () => {
      const wrapper = shallow(<SupplierSearchResults searchResults={searchResults} />)
      const displayedSupplierRows = wrapper.find('.supplier')

      expect(displayedSupplierRows.length).toBe(2)
    })

    test('renders the names correctly', () => {
      const wrapper = snapshotRenderer.create(<SupplierSearchResults searchResults={searchResults} />).toJSON()
      expect(wrapper).toMatchSnapshot()
    })
  })
})
