interface HeaderProps {
  city: string;
  country?: string;
  onMenuClick: () => void;
  onSearchClick: () => void;
  onSettingsClick: () => void;
  isOffline?: boolean;
  lastUpdated?: number;
}

export const Header = ({
  city,
  country,
  onMenuClick,
  onSearchClick,
  onSettingsClick,
  isOffline,
  lastUpdated,
}: HeaderProps) => {
  const updatedText = lastUpdated
    ? new Date(lastUpdated).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  return (
    <>
      <header className="header">
        <button
          className="iconBtn headerIcon"
          onClick={onMenuClick}
          aria-label="Open saved locations"
          title="Saved locations"
        >
          <svg width="22" height="22" viewBox="0 0 24 24">
            <line x1="3" y1="6" x2="21" y2="6" strokeWidth="2" strokeLinecap="round" />
            <line x1="3" y1="12" x2="15" y2="12" strokeWidth="2" strokeLinecap="round" />
            <line x1="3" y1="18" x2="21" y2="18" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        <div className="headerActionsCompact">
          <button
            className="iconBtn headerIcon"
            onClick={onSearchClick}
            aria-label="Search city"
            title="Search city"
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" strokeWidth="2" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>

          <button
            className="iconBtn headerIcon"
            onClick={onSettingsClick}
            aria-label="Open settings"
            title="Settings"
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="3" strokeWidth="2" />
              <path
                d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </header>

      <div className="locationBlock">
        <div className="locationLabelRow">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            className="locPinIcon"
            aria-hidden
          >
            <path
              d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="12" cy="10" r="3" strokeWidth="2" />
          </svg>
          <h2 className="locationLabel">
            {city}
            {country && <span className="locationCountry">, {country}</span>}
          </h2>
        </div>
        {(isOffline || updatedText) && (
          <div className="locationMeta">
            {isOffline && (
              <span className="offlineBadge" title="Showing cached data">
                ⚡ Offline mode
              </span>
            )}
            {updatedText && !isOffline && (
              <span className="updatedText">Updated {updatedText}</span>
            )}
            {updatedText && isOffline && (
              <span className="updatedText muted">· last fetch {updatedText}</span>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Header;
