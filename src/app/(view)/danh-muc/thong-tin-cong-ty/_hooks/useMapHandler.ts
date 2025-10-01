import { useCallback, useState } from "react";

export const useMapHandler = () => {
  const [mapUrl, setMapUrl] = useState<string>("");
  const [currentLat, setCurrentLat] = useState<string>("");
  const [currentLong, setCurrentLong] = useState<string>("");

  // Update map URL when coordinates change
  const updateMapUrl = useCallback((lat: string, lng: string) => {
    if (lat && lng) {
      // Use Google Maps embed URL that works without API key
      const url = `https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d15677.0!2d${lng}!3d${lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1svi!2s!4v1234567890123!5m2!1svi!2s`;
      console.log("Generated map URL:", url); // Debug log
      console.log("Coordinates:", { lat, lng }); // Debug coordinates
      setMapUrl(url);
      setCurrentLat(lat);
      setCurrentLong(lng);
    }
  }, []);

  // Clear map data
  const clearMap = useCallback(() => {
    setMapUrl("");
    setCurrentLat("");
    setCurrentLong("");
  }, []);

  return {
    mapUrl,
    currentLat,
    currentLong,
    updateMapUrl,
    clearMap,
  };
};
