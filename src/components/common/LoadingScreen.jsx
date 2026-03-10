import "./LoadingScreen.css";

function LoadingScreen({ message = "Chargement...", progress = null }) {
  return (
    <div className="loading-screen">
      <div className="loading-content">
        <div className="loading-spinner" />
        <p className="loading-message">{message}</p>
        {progress !== null && (
          <>
            <div className="loading-progress-bar">
              <div
                className="loading-progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="loading-progress-text">{progress}%</span>
          </>
        )}
      </div>
    </div>
  );
}

export default LoadingScreen;