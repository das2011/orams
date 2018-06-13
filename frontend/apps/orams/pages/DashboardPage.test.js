import React from 'react'
import snapshotRenderer from 'react-test-renderer'
import { MemoryRouter } from 'react-router'
import { DashboardPage } from './DashboardPage'

describe('DashboardPage component', () => {
  it('renders correctly', () => {
    const props = {
      errorMessage: null,
      successMessage: null,
      match: {}
    }
    const tree = snapshotRenderer
      .create(
        <MemoryRouter>
          <DashboardPage {...props} />
        </MemoryRouter>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })
})
