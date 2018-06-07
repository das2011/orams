import React from 'react'
import snapshotRenderer from 'react-test-renderer'
import { MemoryRouter } from 'react-router'
import { ReferralReadOnlyPage } from './ReferralReadOnlyPage'

describe('ReferralReadOnlyPage component', () => {
  it('renders correctly when error message is present', () => {
    const props = {
      loadReferralData: jest.fn(),
      match: { params: { id: 1 } }
    }
    const tree = snapshotRenderer
      .create(
        <MemoryRouter>
          <ReferralReadOnlyPage {...props} />
        </MemoryRouter>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })
})
