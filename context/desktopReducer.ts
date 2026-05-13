import { DesktopState, DesktopAction, WindowState } from '@/lib/types';

export const initialState: DesktopState = {
  windows: [
    {
      id: 'terminal-main',
      type: 'terminal',
      title: 'Terminal',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      position: { x: 80, y: 60 },
      size: { width: 700, height: 500 },
      zIndex: 100,
    },
  ],
  topZIndex: 100,
  activeTheme: 'tokyo',
};

let windowCounter = 0;

function getStaggeredPosition(count: number): { x: number; y: number } {
  const base = { x: 100, y: 100 };
  const offset = (count % 10) * 30;
  return { x: base.x + offset, y: base.y + offset };
}

export function desktopReducer(state: DesktopState, action: DesktopAction): DesktopState {
  switch (action.type) {
    case 'OPEN_WINDOW': {
      const { id } = action.payload;
      const existing = state.windows.find(w => w.id === id);

      if (existing) {
        if (existing.isOpen) {
          // Just focus
          const newTop = state.topZIndex + 1;
          return {
            ...state,
            topZIndex: newTop,
            windows: state.windows.map(w =>
              w.id === id
                ? { ...w, zIndex: newTop, isMinimized: false }
                : w
            ),
          };
        } else {
          // Re-open and focus
          const newTop = state.topZIndex + 1;
          return {
            ...state,
            topZIndex: newTop,
            windows: state.windows.map(w =>
              w.id === id
                ? { ...w, isOpen: true, isMinimized: false, zIndex: newTop }
                : w
            ),
          };
        }
      }

      // New window
      windowCounter++;
      const newTop = state.topZIndex + 1;
      const pos = action.payload.position.x === 0 && action.payload.position.y === 0
        ? getStaggeredPosition(windowCounter)
        : action.payload.position;

      const newWindow: WindowState = {
        ...action.payload,
        position: pos,
        isOpen: true,
        isMinimized: false,
        isMaximized: false,
        zIndex: newTop,
      };

      return {
        ...state,
        topZIndex: newTop,
        windows: [...state.windows, newWindow],
      };
    }

    case 'CLOSE_WINDOW': {
      return {
        ...state,
        windows: state.windows.map(w =>
          w.id === action.payload.id ? { ...w, isOpen: false } : w
        ),
      };
    }

    case 'FOCUS_WINDOW': {
      const newTop = state.topZIndex + 1;
      return {
        ...state,
        topZIndex: newTop,
        windows: state.windows.map(w =>
          w.id === action.payload.id ? { ...w, zIndex: newTop } : w
        ),
      };
    }

    case 'MINIMIZE_WINDOW': {
      return {
        ...state,
        windows: state.windows.map(w =>
          w.id === action.payload.id ? { ...w, isMinimized: true } : w
        ),
      };
    }

    case 'MAXIMIZE_WINDOW': {
      const newTop = state.topZIndex + 1;
      return {
        ...state,
        topZIndex: newTop,
        windows: state.windows.map(w =>
          w.id === action.payload.id
            ? { ...w, isMaximized: !w.isMaximized, zIndex: newTop }
            : w
        ),
      };
    }

    case 'RESTORE_WINDOW': {
      const newTop = state.topZIndex + 1;
      return {
        ...state,
        topZIndex: newTop,
        windows: state.windows.map(w =>
          w.id === action.payload.id
            ? { ...w, isMinimized: false, zIndex: newTop }
            : w
        ),
      };
    }

    case 'MOVE_WINDOW': {
      return {
        ...state,
        windows: state.windows.map(w =>
          w.id === action.payload.id
            ? { ...w, position: { x: action.payload.x, y: action.payload.y } }
            : w
        ),
      };
    }

    case 'RESIZE_WINDOW': {
      return {
        ...state,
        windows: state.windows.map(w =>
          w.id === action.payload.id
            ? { ...w, size: { width: action.payload.width, height: action.payload.height } }
            : w
        ),
      };
    }

    case 'SET_THEME': {
      return {
        ...state,
        activeTheme: action.payload.theme,
      };
    }

    default:
      return state;
  }
}
