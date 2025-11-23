import React from 'react'
import { render, screen } from '@testing-library/react'
import { HomePage } from '../Home.page'

test('renders welcome heading and paragraph', () => {
  render(<HomePage />)
  expect(
    screen.getByRole('heading', { name: /welcome to the home page/i })
  ).toBeInTheDocument()
  expect(
    screen.getByText(/main landing page of the application/i)
  ).toBeInTheDocument()
})
