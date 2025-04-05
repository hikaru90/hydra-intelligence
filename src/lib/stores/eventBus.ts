import { writable } from 'svelte/store';

type EventType = 'ADD_MARKER' | 'CANCEL_ADD_MARKER' | 'CONFIRM_ADD_MARKER';

interface EventData {
  type: EventType;
  payload?: any;
}

function createEventBus() {
  const { subscribe, set } = writable<EventData | null>(null);

  return {
    subscribe,
    emit: (type: EventType, payload?: any) => {
      set({ type, payload });
    },
    reset: () => set(null)
  };
}

export const eventBus = createEventBus(); 