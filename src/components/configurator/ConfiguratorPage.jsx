import { Unity } from "react-unity-webgl";
import { useUnity } from "../../hooks/useUnity";
import LoadingScreen from "../common/LoadingScreen";
import "./ConfiguratorPage.css";

function ConfiguratorPage() {
  const { unityProvider, isLoaded, loadingProgression } = useUnity();

  return (
    <div className="configurator-page">
      {!isLoaded && (
        <LoadingScreen
          message="Chargement du configurateur..."
          progress={Math.round(loadingProgression * 100)}
        />
      )}

      <div
        className="unity-container"
        style={{ visibility: isLoaded ? "visible" : "hidden" }}
      >
        <Unity
          unityProvider={unityProvider}
          className="unity-canvas"
          style={{ width: "100%", height: "100%" }}
          tabIndex={1}
        />
      </div>
    </div>
  );
}

export default ConfiguratorPage;