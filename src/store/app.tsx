import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { ModeId } from "../data/types";

export type Route =
  | { name: "home" }
  | { name: "players" }
  | { name: "settings" }
  | { name: "game"; modeId: ModeId };

export interface Settings {
  /** Buzz on taps where supported. */
  haptics: boolean;
  /** Scanline / glow atmosphere. Off = calmer, higher-contrast. */
  effects: boolean;
  /** Adds hotter questions & dares to every game. */
  spicy: boolean;
}

const DEFAULT_SETTINGS: Settings = {
  haptics: true,
  effects: true,
  spicy: false,
};

const PLAYERS_KEY = "ptp.players";
const SETTINGS_KEY = "ptp.settings";

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

interface AppContextValue {
  route: Route;
  navigate: (route: Route) => void;
  back: () => void;

  players: string[];
  addPlayer: (name: string) => void;
  removePlayer: (index: number) => void;
  clearPlayers: () => void;

  settings: Settings;
  setSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [history, setHistory] = useState<Route[]>([{ name: "home" }]);
  const [players, setPlayers] = useState<string[]>(() =>
    load<string[]>(PLAYERS_KEY, []),
  );
  const [settings, setSettings] = useState<Settings>(() =>
    load<Settings>(SETTINGS_KEY, DEFAULT_SETTINGS),
  );

  useEffect(() => {
    localStorage.setItem(PLAYERS_KEY, JSON.stringify(players));
  }, [players]);

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  // Reflect the "effects off" preference at the root so CSS can respond.
  useEffect(() => {
    document.documentElement.dataset.effects = settings.effects ? "on" : "off";
  }, [settings.effects]);

  const navigate = useCallback((route: Route) => {
    setHistory((h) => [...h, route]);
    window.scrollTo(0, 0);
  }, []);

  const back = useCallback(() => {
    setHistory((h) => (h.length > 1 ? h.slice(0, -1) : h));
  }, []);

  const addPlayer = useCallback((name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setPlayers((p) => [...p, trimmed]);
  }, []);

  const removePlayer = useCallback((index: number) => {
    setPlayers((p) => p.filter((_, i) => i !== index));
  }, []);

  const clearPlayers = useCallback(() => setPlayers([]), []);

  const setSetting = useCallback<AppContextValue["setSetting"]>((key, value) => {
    setSettings((s) => ({ ...s, [key]: value }));
  }, []);

  const value = useMemo<AppContextValue>(
    () => ({
      route: history[history.length - 1],
      navigate,
      back,
      players,
      addPlayer,
      removePlayer,
      clearPlayers,
      settings,
      setSetting,
    }),
    [
      history,
      navigate,
      back,
      players,
      addPlayer,
      removePlayer,
      clearPlayers,
      settings,
      setSetting,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
