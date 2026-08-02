interface LocationPermissionProps {
  onAllow: () => void;
  onDeny: () => void;
}

export const LocationPermission = ({ onAllow, onDeny }: LocationPermissionProps) => {
  return (
    <div className="modalOverlay">
      <div className="modalContent">
        <div className="modalIcon">📍</div>
        <h2 className="modalTitle">Use your location?</h2>
        <p className="modalDescription">
          Allow The Weather App to access your device's location to show accurate weather data for your current area.
        </p>
        <div className="modalButtons">
          <button className="modalBtn modalBtnDeny" onClick={onDeny}>
            Not now
          </button>
          <button className="modalBtn modalBtnAllow" onClick={onAllow}>
            Allow
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationPermission;
