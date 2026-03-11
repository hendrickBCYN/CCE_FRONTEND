import { useEffect, useCallback, useRef } from "react";
import { useUnityContext } from "react-unity-webgl";
import { useAuth } from "./useAuth";

export function useUnity() {
  const { user, token } = useAuth();
  const hasSentAuth = useRef(false);

  const {
    unityProvider,
    sendMessage,
    addEventListener,
    removeEventListener,
    loadingProgression,
    isLoaded,
  } = useUnityContext({
    loaderUrl: "/unity-build/Build/Builds.loader.js",
    dataUrl: "/unity-build/Build/Builds.data.unityweb",
    frameworkUrl: "/unity-build/Build/Builds.framework.js.unityweb",
    codeUrl: "/unity-build/Build/Builds.wasm.unityweb",
  });

  // Quand Unity est chargé, transmettre le token et les infos user
  useEffect(() => {
    if (isLoaded && token && user && !hasSentAuth.current) {
      try {
        sendMessage("NetworkManager", "ReceiveAuthToken", token);
        sendMessage(
          "NetworkManager",
          "ReceiveUserInfo",
          JSON.stringify({
            email: user.email,
            displayName: user.display_name,
          })
        );
        hasSentAuth.current = true;
      } catch (err) {
        console.error("Erreur communication avec Unity:", err);
      }
    }
  }, [isLoaded, token, user, sendMessage]);

  // Écouter les événements Unity → React
  const handlePdfGenerated = useCallback((pdfBase64) => {
    const link = document.createElement("a");
    link.href = `data:application/pdf;base64,${pdfBase64}`;
    link.download = `CCE_configuration_${Date.now()}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  useEffect(() => {
    addEventListener("OnPdfGenerated", handlePdfGenerated);
    return () => {
      removeEventListener("OnPdfGenerated", handlePdfGenerated);
    };
  }, [addEventListener, removeEventListener, handlePdfGenerated]);

  return {
    unityProvider,
    isLoaded,
    loadingProgression,
  };
}