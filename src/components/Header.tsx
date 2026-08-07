import {HugeiconsIcon} from "@hugeicons/react";
import {Menu01Icon,Search01Icon,Settings02Icon,SunCloud02Icon } from "@hugeicons/core-free-icons";



interface HeaderProps {
  city: string;
  country?: string;
  onMenuClick: () => void;
  onSearchClick: () => void;
  onSettingsClick: () => void;
  lastUpdated?: number;
  isOffline?: boolean;
}

function Header({
  onMenuClick,
  onSearchClick,
  onSettingsClick,
}: HeaderProps) {
  return (
    <header className="topNav">

      <div className="topNavInner">

        <button
          className="iconBtn"
          onClick={onMenuClick}
          aria-label="Open saved locations"
        >
          <HugeiconsIcon icon={Menu01Icon}  size={22} />
        </button>

   

        <div className="navBrand">

          <div className="brandIcon">
            <HugeiconsIcon icon={SunCloud02Icon }/>
          </div>

          <div className="brandText">
            <span className="brandName">
              The WeatherApp
            </span>

            <span className="brandTag">
              Weather Forecast
            </span>

          </div>

        </div>

        <div className="navSpacer" />

        


        <button className="iconBtn" onClick={onSearchClick} aria-label="Search city" >

          <HugeiconsIcon icon={Search01Icon} size={22} />

        </button>

        <button className="iconBtn" onClick={onSettingsClick} aria-label="Settings" >

          <HugeiconsIcon  icon={Settings02Icon} size={22} />

        </button>

      </div>

    </header>
  );
}

export default Header;