import { useApp } from "./store/app";
import { Home } from "./screens/Home";
import { PlayerSetup } from "./screens/PlayerSetup";
import { Settings } from "./screens/Settings";
import { PromptGame } from "./screens/PromptGame";
import { TruthOrDare } from "./screens/TruthOrDare";
import { Paranoia } from "./screens/Paranoia";
import { KingsCup } from "./screens/KingsCup";
import { getMode } from "./data/modes";

function Game({ modeId }: { modeId: ReturnType<typeof getMode>["id"] }) {
  const mode = getMode(modeId);
  switch (mode.kind) {
    case "prompt":
      return <PromptGame mode={mode} />;
    case "truthOrDare":
      return <TruthOrDare mode={mode} />;
    case "paranoia":
      return <Paranoia mode={mode} />;
    case "kings":
      return <KingsCup mode={mode} />;
  }
}

export function App() {
  const { route } = useApp();
  switch (route.name) {
    case "home":
      return <Home />;
    case "players":
      return <PlayerSetup />;
    case "settings":
      return <Settings />;
    case "game":
      return <Game modeId={route.modeId} />;
  }
}
