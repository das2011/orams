import React from 'react'
import snapshotRenderer from 'react-test-renderer'
import { MemoryRouter } from 'react-router'
import Adapter from 'enzyme-adapter-react-16'
import Enzyme, { shallow } from 'enzyme'
import { ViewReferralPage } from './ViewReferralPage'

Enzyme.configure({ adapter: new Adapter() })

describe('ViewReferralPage component', () => {
  it('renders correctly', () => {
    const props = {
      loadReferralData: jest.fn(),
      match: { params: { id: 1 } }
    }
    const tree = snapshotRenderer
      .create(
        <MemoryRouter>
          <ViewReferralPage {...props} />
        </MemoryRouter>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('loads referral data on mount', () => {
    const mockLoadReferralData = jest.fn()
    const props = {
      loadReferralData: mockLoadReferralData,
      match: { params: { id: 15 } }
    }

    shallow(<ViewReferralPage {...props} />)

    expect(mockLoadReferralData).toHaveBeenCalledTimes(1)
    expect(mockLoadReferralData).toHaveBeenCalledWith(15)
  })
})
