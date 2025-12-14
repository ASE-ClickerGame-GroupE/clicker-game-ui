import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RoomManager } from './RoomManager';

describe('RoomManager', () => {
  const mockOnRoomReady = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('shows initial selection screen', () => {
    render(<RoomManager onRoomReady={mockOnRoomReady} />);

    expect(screen.getByText('Multiplayer Aim Clicker')).toBeInTheDocument();
    expect(screen.getByText('Create a room or join an existing one to play with others')).toBeInTheDocument();
    expect(screen.getByText('CREATE ROOM')).toBeInTheDocument();
    expect(screen.getByText('JOIN ROOM')).toBeInTheDocument();
  });

  test('navigates to create room screen when CREATE ROOM is clicked', async () => {
    const user = userEvent.setup();
    render(<RoomManager onRoomReady={mockOnRoomReady} />);

    await user.click(screen.getByText('CREATE ROOM'));

    expect(screen.getByText('Create a Room')).toBeInTheDocument();
    expect(screen.getByText('GENERATE ROOM')).toBeInTheDocument();
  });

  test('navigates to join room screen when JOIN ROOM is clicked', async () => {
    const user = userEvent.setup();
    render(<RoomManager onRoomReady={mockOnRoomReady} />);

    await user.click(screen.getByText('JOIN ROOM'));

    expect(screen.getByText('Join a Room')).toBeInTheDocument();
    expect(screen.getByLabelText('Room Code')).toBeInTheDocument();
  });

  test('generates and returns room ID when GENERATE ROOM is clicked', async () => {
    const user = userEvent.setup();
    render(<RoomManager onRoomReady={mockOnRoomReady} />);

    await user.click(screen.getByText('CREATE ROOM'));
    await user.click(screen.getByText('GENERATE ROOM'));

    expect(mockOnRoomReady).toHaveBeenCalledTimes(1);
    const roomId = mockOnRoomReady.mock.calls[0][0];
    expect(roomId).toBeTruthy();
    expect(typeof roomId).toBe('string');
    expect(roomId.length).toBeGreaterThan(0);
  });

  test('allows entering and joining room with code', async () => {
    const user = userEvent.setup();
    render(<RoomManager onRoomReady={mockOnRoomReady} />);

    await user.click(screen.getByText('JOIN ROOM'));
    
    const input = screen.getByLabelText('Room Code');
    await user.type(input, 'ABC123');
    
    await user.click(screen.getByText('JOIN'));

    expect(mockOnRoomReady).toHaveBeenCalledWith('ABC123');
  });

  test('JOIN button is disabled when room code is empty', async () => {
    const user = userEvent.setup();
    render(<RoomManager onRoomReady={mockOnRoomReady} />);

    await user.click(screen.getByText('JOIN ROOM'));
    
    const joinButton = screen.getByText('JOIN');
    expect(joinButton).toBeDisabled();
  });

  test('can navigate back from create room screen', async () => {
    const user = userEvent.setup();
    render(<RoomManager onRoomReady={mockOnRoomReady} />);

    await user.click(screen.getByText('CREATE ROOM'));
    expect(screen.getByText('Create a Room')).toBeInTheDocument();

    await user.click(screen.getByText('Back'));
    expect(screen.getByText('Create a room or join an existing one to play with others')).toBeInTheDocument();
  });

  test('can navigate back from join room screen', async () => {
    const user = userEvent.setup();
    render(<RoomManager onRoomReady={mockOnRoomReady} />);

    await user.click(screen.getByText('JOIN ROOM'));
    expect(screen.getByText('Join a Room')).toBeInTheDocument();

    await user.click(screen.getByText('Back'));
    expect(screen.getByText('Create a room or join an existing one to play with others')).toBeInTheDocument();
  });
});
