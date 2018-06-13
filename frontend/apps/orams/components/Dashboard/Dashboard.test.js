import React from 'react'
import snapshotRenderer from 'react-test-renderer'
import Dashboard from './Dashboard'

describe('Dashboard component', () => {
  it('renders correctly when error message is present', () => {
    const props = {
      errorMessage: 'This is an error'
    }
    const tree = snapshotRenderer.create(<Dashboard {...props} />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders correctly when success message is present', () => {
    const props = {
      successMessage: 'Successful operation'
    }
    const tree = snapshotRenderer.create(<Dashboard {...props} />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders correctly when no banner messages present', () => {
    const props = {}
    const tree = snapshotRenderer.create(<Dashboard {...props} />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
