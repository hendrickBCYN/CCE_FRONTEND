import { useEffect, useCallback, useRef } from "react";
import { useUnityContext } from "react-unity-webgl";
import { useAuth } from "./useAuth";
import api from "../services/api";

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

  // React → Unity : transmettre les données d'auth
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

  // Unity → React : sauvegarder une configuration
  const handleSaveRequest = useCallback(async (configurationJson) => {
    try {
      const data = JSON.parse(configurationJson);
      await api.post("/configurations", { name: "Configuration CCE", data });
      console.log("Configuration sauvegardée");
      sendMessage("NetworkManager", "ReceiveSaveResult", "success");
    } catch (err) {
      console.error("Erreur sauvegarde:", err);
      sendMessage("NetworkManager", "ReceiveSaveResult", "error");
    }
  }, [sendMessage]);

  // Unity → React : charger une configuration
  const handleLoadRequest = useCallback(async () => {
    try {
      const response = await api.get("/configurations");
      const configs = response.data;
      if (configs.length > 0) {
        const latest = await api.get(`/configurations/${configs[0].id}`);
        sendMessage(
          "NetworkManager",
          "ReceiveConfiguration",
          JSON.stringify(latest.data.data)
        );
      }
    } catch (err) {
      console.error("Erreur chargement:", err);
    }
  }, [sendMessage]);

  // Unity → React : télécharger un PDF
  const handlePdfGenerated = useCallback((pdfBase64) => {
    const link = document.createElement("a");
    link.href = `data:application/pdf;base64,${pdfBase64}`;
    link.download = `CCE_configuration_${Date.now()}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  // Enregistrement des listeners
  useEffect(() => {
    addEventListener("OnSaveRequest", handleSaveRequest);
    addEventListener("OnLoadRequest", handleLoadRequest);
    addEventListener("OnPdfGenerated", handlePdfGenerated);

    return () => {
      removeEventListener("OnSaveRequest", handleSaveRequest);
      removeEventListener("OnLoadRequest", handleLoadRequest);
      removeEventListener("OnPdfGenerated", handlePdfGenerated);
    };
  }, [
    addEventListener,
    removeEventListener,
    handleSaveRequest,
    handleLoadRequest,
    handlePdfGenerated,
  ]);

  return {
    unityProvider,
    isLoaded,
    loadingProgression,
  };
}
