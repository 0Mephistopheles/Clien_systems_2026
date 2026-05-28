import { useEffect, useMemo, useState } from 'react';
import { subscribeToRoom } from '../services/realtime';
import { listMessages, listRooms, sendMessage, updateRoom } from '../services/gameService';
import type { Message, Room } from '../types';
import { emptyBoard, getTicTacToeWinner } from '../utils/gameLogic';

type RealtimeRoomState = {
  room: Room | null;
  messages: Message[];
  board: string[];
  presence: Record<string, unknown[]>;
  loading: boolean;
};

export function useRealtimeRoom(roomId: string | undefined, userId: string | undefined) {
  const [state, setState] = useState<RealtimeRoomState>({
    room: null,
    messages: [],
    board: emptyBoard(),
    presence: {},
    loading: true,
  });

  useEffect(() => {
    if (!roomId || !userId) {
      setState((current) => ({ ...current, loading: false }));
      return;
    }

    let active = true;

    const bootstrap = async () => {
      const [rooms, messageList] = await Promise.all([listRooms(), listMessages(roomId)]);
      const room = rooms.find((entry) => entry.id === roomId) ?? null;

      if (!active) return;

      setState({
        room,
        messages: messageList,
        board: room?.board?.length ? room.board : emptyBoard(),
        presence: {},
        loading: false,
      });
    };

    const subscription = subscribeToRoom(roomId, userId, {
      onBoard: (board) => {
        setState((current) => ({ ...current, board }));
      },
      onMessage: (payload) => {
        const message = payload as Message;
        if (message.roomId !== roomId) return;
        setState((current) => ({
          ...current,
          messages: [...current.messages, message],
        }));
      },
      onPresence: (presence) => {
        setState((current) => ({ ...current, presence }));
      },
      onRoom: (room) => {
        setState((current) => ({ ...current, room: room as Room, board: (room as Room).board ?? current.board }));
      },
    });

    void bootstrap();

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [roomId, userId]);

  const actions = useMemo(
    () => ({
      async sendChatMessage(content: string) {
        if (!roomId) return;
        const message = await sendMessage(roomId, content);
        setState((current) => ({
          ...current,
          messages: [...current.messages, message],
        }));
      },
      async makeMove(index: number, player: 'X' | 'O') {
        if (!roomId) return;
        setState((current) => {
          if (current.board[index] || current.room?.winner) return current;

          const board = [...current.board];
          board[index] = player;
          const winner = getTicTacToeWinner(board);

          void updateRoom(roomId, {
            board,
            currentTurn: player === 'X' ? 'O' : 'X',
            winner: winner as Room['winner'],
            lastActivity: new Date().toISOString(),
          });

          return {
            ...current,
            board,
            room: current.room
              ? {
                  ...current.room,
                  board,
                  currentTurn: player === 'X' ? 'O' : 'X',
                  winner: winner as Room['winner'],
                  lastActivity: new Date().toISOString(),
                }
              : current.room,
          };
        });
      },
    }),
    [roomId],
  );

  return {
    ...state,
    ...actions,
  };
}
