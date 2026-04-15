type LaunchScreenProps = {
  status?: string;
};

const LaunchScreen = ({
  status = "Launching secure workspace",
}: LaunchScreenProps) => {
  return (
    <div className="launch-screen" role="status" aria-live="polite">
      <div className="launch-screen__shell">
        <h1 className="launch-screen__title">GSR ERP</h1>
        <div className="launch-screen__loader" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <div className="launch-screen__status-label">{status}</div>
      </div>
    </div>
  );
};

export default LaunchScreen;
