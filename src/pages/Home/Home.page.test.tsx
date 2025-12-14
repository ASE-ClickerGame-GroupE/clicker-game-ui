jest.mock('../../assets/target.png', () => 'mock-target-image');
jest.mock('../../liveblocks.config.ts', () => ({
  suspense: {
    RoomProvider: ({ children }: { children: React.ReactNode }) => children,
    useRoom: () => ({}),
    useMyPresence: () => [null, jest.fn()],
    useUpdateMyPresence: () => jest.fn(),
    useOthers: () => [],
    useSelf: () => null,
    useStorage: () => null,
    useMutation: () => jest.fn(),
  },
}));

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

  test('shows mode selection initially', () => {
    render(<HomePage />, { wrapper: QueryProviderWrapper })

    expect(screen.getByText('Aim Clicker')).toBeInTheDocument();
    expect(screen.getByText('Choose your game mode')).toBeInTheDocument();
    expect(screen.getByText('SINGLE PLAYER')).toBeInTheDocument();
    expect(screen.getByText('MULTIPLAYER')).toBeInTheDocument();

    expect(screen.queryByTestId('game-area')).toBeNull();
    expect(screen.queryByTestId('score')).toBeNull();
    expect(screen.queryByTestId('timer')).toBeNull();
    expect(screen.queryByTestId('target')).toBeNull();
  });

  test('starts single player game and increments score when target is clicked once', async () => {
    const user = userEvent.setup();
    render(<HomePage />, { wrapper: QueryProviderWrapper })

    // Select single player mode
    await user.click(screen.getByText('SINGLE PLAYER'));

    // Click play button
    await user.click(screen.getByTestId('play-button'));

    expect(screen.getByTestId('game-area')).toBeInTheDocument();
    expect(screen.getByTestId('score')).toHaveTextContent('Score: 0');
    expect(screen.getByTestId('timer')).toBeInTheDocument();

    const target = await screen.findByTestId('target');
    await user.click(target);

    expect(screen.getByTestId('score')).toHaveTextContent('Score: 1');
  });
});
