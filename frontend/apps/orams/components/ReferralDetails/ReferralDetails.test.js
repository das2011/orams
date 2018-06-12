import React from 'react'
import snapshotRenderer from 'react-test-renderer'
import ReferralDetails from './ReferralDetails'

describe('ReferralDetails component', () => {
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
    const props = {
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
    const tree = snapshotRenderer.create(<ReferralDetails {...props} />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
