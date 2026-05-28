import type { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '../api/supabase';

export type RealtimeCallbacks = {
  onBoard?: (board: string[]) => void;
  onMessage?: (message: unknown) => void;
  onPresence?: (users: Record<string, unknown[]>) => void;
  onRoom?: (room: unknown) => void;
};

export function subscribeToRoom(roomId: string, userId: string, callbacks: RealtimeCallbacks) {
  if (!supabase) {
    return {
      channel: null as RealtimeChannel | null,
      unsubscribe: () => undefined,
    };
  }

  const channel = supabase.channel(`room:${roomId}`, {
    config: {
      presence: { key: userId },
    },
  });

  const onBoard = callbacks.onBoard;
  const onMessage = callbacks.onMessage;
  const onPresence = callbacks.onPresence;
  const onRoom = callbacks.onRoom;

  if (onBoard) {
    channel.on('broadcast', { event: 'board' }, ({ payload }) => {
      onBoard((payload as { board: string[] }).board);
    });
  }

  if (onMessage) {
    channel.on('broadcast', { event: 'message' }, ({ payload }) => {
      onMessage(payload);
    });
    channel.on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'messages', filter: `room_id=eq.${roomId}` },
      ({ new: nextMessage }) => {
        onMessage(nextMessage);
      },
    );
  }

  if (onRoom) {
    channel.on('postgres_changes', { event: '*', schema: 'public', table: 'game_rooms', filter: `id=eq.${roomId}` }, ({ new: nextRoom }) => {
      onRoom(nextRoom);
    });
  }

  channel.on('presence', { event: 'sync' }, () => {
    onPresence?.(channel.presenceState());
  });

  channel.subscribe(async (status) => {
    if (status === 'SUBSCRIBED') {
      await channel.track({ userId, onlineAt: new Date().toISOString() });
    }
  });

  return {
    channel,
    unsubscribe: () => {
      supabase.removeChannel(channel);
    },
  };
}
