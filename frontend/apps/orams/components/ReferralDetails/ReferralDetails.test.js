import React from 'react'
import snapshotRenderer from 'react-test-renderer'
import Adapter from 'enzyme-adapter-react-16'
import Enzyme, { shallow } from 'enzyme'
import ReferralDetails from './ReferralDetails'

Enzyme.configure({ adapter: new Adapter() })

describe('ReferralDetails component', () => {
  const defaultProps = {
    referralDetails: {
      supplier: 'Supplier name',
      price: 123,
      dateCreated: '2018-06-07T12:13:24.597Z',
      regionName: 'East',
      regionState: 'NSW',
      createdBy: 'Stan Lee',
      referralId: '456',
      agency: 'ATO'
    }
  }

  it('renders correctly when error message is present', () => {
    const props = {
      errorMessage: 'This is an error'
    }
    const tree = snapshotRenderer.create(<ReferralDetails {...props} />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders correctly when page is loading', () => {
    const props = {
      isLoading: true
    }
    const tree = snapshotRenderer.create(<ReferralDetails {...props} />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders correctly when there is no error', () => {
    const tree = snapshotRenderer.create(<ReferralDetails {...defaultProps} />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders correctly with button for supplier', () => {
    const props = {
      ...defaultProps,
      userType: 'supplier'
    }
    const tree = snapshotRenderer.create(<ReferralDetails {...props} />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('handles Accept referral click by supplier', () => {
    const mockAcceptReferral = jest.fn()
    const mockHistoryPush = jest.fn()
    const props = {
      ...defaultProps,
      userType: 'supplier',
      acceptReferral: mockAcceptReferral,
      history: {
        push: mockHistoryPush
      }
    }
    const component = shallow(<ReferralDetails {...props} />)

    component.find('.referral--accept').simulate('click')

    expect(mockAcceptReferral).toHaveBeenCalledTimes(1)
    expect(mockAcceptReferral).toHaveBeenCalledWith('456')
    expect(mockHistoryPush).toHaveBeenCalledTimes(1)
    expect(mockHistoryPush).toHaveBeenCalledWith('/dashboard')
  })
})
