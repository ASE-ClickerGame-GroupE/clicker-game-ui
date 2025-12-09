jest.mock('../../assets/target.png', () => 'mock-target-image');

import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HomePage from './Home.page.tsx';
import { QueryProviderWrapper } from '../../test-helpers/wrappers.tsx'
import Cookies from 'js-cookie'

jest.mock('js-cookie');

describe('HomePage Aim Clicker', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test.skip('shows Login button when not authenticated', () => {
    (Cookies.get as jest.Mock).mockImplementation(() => null)
    render(<HomePage />, { wrapper: QueryProviderWrapper })
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument()
  })

  test.skip('shows Logout button when authenticated', () => {
    (Cookies.get as jest.Mock).mockImplementation(() => 'token-123')
    render(<HomePage />, { wrapper: QueryProviderWrapper })
    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument()
  })

  test('shows only play button initially', () => {
    render(<HomePage />, { wrapper: QueryProviderWrapper })

    expect(screen.getByTestId('play-button')).toBeInTheDocument();
    expect(screen.getByText('Aim Clicker')).toBeInTheDocument();

    expect(screen.queryByTestId('game-area')).toBeNull();
    expect(screen.queryByTestId('score')).toBeNull();
    expect(screen.queryByTestId('timer')).toBeNull();
    expect(screen.queryByTestId('target')).toBeNull();
  });

  test('starts game and increments score when target is clicked once', async () => {
    const user = userEvent.setup();
    render(<HomePage />, { wrapper: QueryProviderWrapper })

    await user.click(screen.getByTestId('play-button'));

    expect(screen.getByTestId('game-area')).toBeInTheDocument();
    expect(screen.getByTestId('score')).toHaveTextContent('Score: 0');
    expect(screen.getByTestId('timer')).toBeInTheDocument();

    const target = await screen.findByTestId('target');
    await user.click(target);

    expect(screen.getByTestId('score')).toHaveTextContent('Score: 1');
  });
});
