import { useState, useEffect } from 'react';
import { carsAPI } from '../services/api';

// Cache mémoire au niveau module : toutes les pages qui utilisent ce hook
// partagent le même résultat, un seul appel réseau pour toute la session.
let cache = null;
let inFlight = null;

export default function useCarSuggestions() {
  const [suggestions, setSuggestions] = useState(cache || []);

  useEffect(() => {
    if (cache) { setSuggestions(cache); return; }

    if (!inFlight) {
      inFlight = carsAPI.getSuggestions()
        .then(({ data }) => { cache = data.suggestions; return cache; })
        .catch(() => []);
    }
    inFlight.then(setSuggestions);
  }, []);

  return suggestions;
}
