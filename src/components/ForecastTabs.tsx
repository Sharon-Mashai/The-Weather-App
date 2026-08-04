import { HugeiconsIcon } from "@hugeicons/react";
import {
  Clock01Icon,
  Calendar03Icon,
} from "@hugeicons/core-free-icons";

export type ForecastTab = "hourly" | "weekly";

interface ForecastTabsProps {
  active: ForecastTab;
  onChange: (tab: ForecastTab) => void;
}

export default function ForecastTabs({
  active,
  onChange,
}: ForecastTabsProps) {
  return (
    <div className="forecastTabs">
      <button
        className={`tabBtn ${active === "hourly" ? "active" : ""}`}
        onClick={() => onChange("hourly")}
      >
        <HugeiconsIcon icon={Clock01Icon} size={18} />
        Hourly
      </button>

      <button
        className={`tabBtn ${active === "weekly" ? "active" : ""}`}
        onClick={() => onChange("weekly")}
      >
        <HugeiconsIcon icon={Calendar03Icon} size={18} />
        Weekly
      </button>
    </div>
  );
}