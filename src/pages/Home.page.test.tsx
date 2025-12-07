import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HomePage from './Home.page';
import { QueryProviderWrapper } from '../test-helpers/wrappers'

describe('HomePage Aim Clicker', () => {
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
