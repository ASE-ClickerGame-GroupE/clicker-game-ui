import React from 'react'
import { render, screen } from '@testing-library/react'
import { QueryProviderWrapper } from '../test-helpers/wrappers'
import { useFetchResults } from './useFetchResults'

function TestComponent() {
  const { data, isFetching, error } = useFetchResults()
  if (isFetching) {
    return <div>LOADING</div>
  }
  if (error) {
    return <div>ERROR</div>
  }
  return <div>DATA: {JSON.stringify(data)}</div>
}

describe('useFetchResults', () => {
  it('renders data from fetchResults', async () => {
    render(<TestComponent />, { wrapper: QueryProviderWrapper })

    // initial loading state should show
    expect(screen.getByText('LOADING')).toBeTruthy()

    const dataNode = await screen.findByText(/DATA:/)
    expect(dataNode.textContent).toContain('DATA:')
  })
})
