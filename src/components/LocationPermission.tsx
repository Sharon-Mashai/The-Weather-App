import { HugeiconsIcon } from "@hugeicons/react";
import {
  Location01Icon,
  Cancel01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";

interface LocationPermissionProps {
  onAllow: () => void;
  onDeny: () => void;
}

export default function LocationPermission({
  onAllow,
  onDeny,
}: LocationPermissionProps) {
  return (
    <div className="modalOverlay">

      <div className="modalContent">

        <div className="modalIcon">

          <HugeiconsIcon
            icon={Location01Icon}
            size={60}
          />

        </div>

        <h2 className="modalTitle">
          Allow Location Access?
        </h2>

        <p className="modalDescription">
          Your current location helps us show the most accurate weather forecast.
          If you choose not to allow location access, the app will use
          <strong> Polokwane</strong> as the default location.
        </p>

        <div className="modalButtons">

          <button
            className="modalBtn modalBtnDeny"
            onClick={onDeny}
          >
            <HugeiconsIcon
              icon={Cancel01Icon}
              size={18}
            />
            Deny
          </button>

          <button
            className="modalBtn modalBtnAllow"
            onClick={onAllow}
          >
            <HugeiconsIcon
              icon={Tick02Icon}
              size={18}
            />
            Allow
          </button>

        </div>

      </div>

    </div>
  );
}