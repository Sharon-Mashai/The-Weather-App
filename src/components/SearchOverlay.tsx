import { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {Search01Icon, Cancel01Icon,Location01Icon,} from "@hugeicons/core-free-icons";
import { searchCity } from "../services/weatherApi";

interface SearchResult {
  name: string;
  country: string;
  lat: number;
  lon: number;
}

interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
  onSelectCity: (city: SearchResult) => void;
}

export default function SearchOverlay({
  open,
  onClose,
  onSelectCity,
}: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const [cities, setCities] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      const t = window.setTimeout(() => setCities([]), 0);
      return () => window.clearTimeout(t);
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);

        const results = await searchCity(query);

        setCities(results);
      } catch {
        setCities([]);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  if (!open) return null;

  return (
    <div className="modalOverlay">

      <div className="modalContent searchPanel">

        <div className="searchHeader">

          <div className="searchInputWrap">

            <HugeiconsIcon icon={Search01Icon}size={18} />

            <input autoFocus type="text" placeholder="Search city..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />

          </div>

          <button className="textBtn" onClick={onClose} >
            <HugeiconsIcon icon={Cancel01Icon} size={18}/>
          </button>

        </div>

        {loading && (
          <p className="suggestHint">
            Searching...
          </p>
        )}

        {!loading && cities.length === 0 && query && (
          <p className="suggestHint">
            No cities found.
          </p>
        )}

        <ul className="suggestionsList">

          {cities.map((city) => (

            <li key={`${city.name}-${city.lat}`}>

              <button className="suggestBtn"   onClick={() => {
                  onSelectCity(city);
                  onClose();
                }}
              >

                <HugeiconsIcon icon={Location01Icon} size={18} />

                <div className="suggestText">

                  <strong>{city.name}</strong>

                  <small>{city.country}</small>

                </div>

              </button>

            </li>

          ))}

        </ul>

      </div>

    </div>
  );
}