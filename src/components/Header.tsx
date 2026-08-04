import {HugeiconsIcon} from "@hugeicons/react";
import {Menu01Icon,Search01Icon,Settings02Icon,Location01Icon} from "@hugeicons/core-free-icons";


interface HeaderProps {
  city: string;
  country?: string;
  onMenuClick: () => void;
  onSearchClick: () => void;
  onSettingsClick: () => void;
  lastUpdated?: number;
}

function Header({
  city,
  country,
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
            🌤
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

        <div className="navLocation">

          <HugeiconsIcon
            icon={Location01Icon}
            size={18}
          />

          <div>

            <strong>
              {city}
            </strong>

            {country && (
              <div className="locationCountry">
                {country}
              </div>
            )}

          </div>

        </div>


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