import React, { useEffect, useState, useCallback } from 'react';
import {
  GoogleMap,
  Marker,
  Autocomplete,
  useJsApiLoader,
} from '@react-google-maps/api';
import withAuth from '../utils/withAuth';

const libraries = ['places'];

const GoogleMapsComponent = ({
  setLatitude,
  setLongitude,
  isEditable = false,
  userLatitude,
  userLongitude,
}) => {
  const [lat, setLat] = useState(userLatitude);
  const [lng, setLng] = useState(userLongitude);
  const [markerPosition, setMarkerPosition] = useState({
    lat: userLatitude,
    lng: userLongitude,
  });
  const [autocomplete, setAutocomplete] = useState(null);
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  useEffect(() => {
    setLatitude(parseFloat(lat));
    setLongitude(parseFloat(lng));
    setMarkerPosition({ lat: parseFloat(lat), lng: parseFloat(lng) });
  }, [lat, lng, setLatitude, setLongitude]);

  const handlePlaceChanged = useCallback(() => {
    if (autocomplete) {
      try {
        const place = autocomplete.getPlace();

        if (!place.geometry) {
          // Handle case where a place name wasn't found, check for lat/lng format
          const latLngPattern = /(-?\d+(\.\d+)?)(?:,|\S)\s*(-?\d+(\.\d+)?)/;
          const match = place.name.match(latLngPattern);

          if (match) {
            const newLat = parseFloat(match[1]);
            const newLng = parseFloat(match[3]);

            if (!isNaN(newLat) && !isNaN(newLng)) {
              setLat(newLat);
              setLng(newLng);
              return;
            }
          }
        }

        const latLng = place.geometry.location;
        const newLat = latLng.lat();
        const newLng = latLng.lng();

        setLat(newLat);
        setLng(newLng);
      } catch (error) {
        alert('Invalid location input or no results');
        return;
      }
    }
  }, [autocomplete]);

  const handleMapClick = useCallback(
    (event) => {
      if (!isEditable) return;
      const newLat = event.latLng.lat();
      const newLng = event.latLng.lng();
      setLat(newLat);
      setLng(newLng);
    },
    [isEditable]
  );

  const redMarkerIcon = 'https://maps.google.com/mapfiles/ms/icons/red-dot.png';

  const renderMap = useCallback(() => {
    return (
      <div className="w-full">
        <div className="font-semibold w-full text-start py-1">
          <input
            type="text"
            name="latitude"
            placeholder="Latitude"
            value={lat}
            required
            className="my-2 px-4 py-2 w-1/2 text-gray-700 bg-white border border-gray-300 rounded-md focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            onChange={(e) => {
              setLat(e.target.value);
              setLatitude(e.target.value);
            }}
            disabled={!isEditable}
          />
          <input
            type="text"
            name="longitude"
            placeholder="Longitude"
            required
            value={lng}
            className="my-2 px-4 py-2 w-1/2 text-gray-700 bg-white border border-gray-300 rounded-md focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            onChange={(e) => {
              setLng(e.target.value);
              setLongitude(e.target.value);
            }}
            disabled={!isEditable}
          />
        </div>
        {isEditable && (
          <div className="search-box relative w-full">
            <Autocomplete
              onLoad={(auto) => setAutocomplete(auto)}
              onPlaceChanged={handlePlaceChanged}
            >
              <input
                type="text"
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                  }
                }}
                placeholder="Search for a location"
                className="my-2 w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:border-indigo-500 focus:outline
                focus:ring-2 focus:ring-indigo-200"
              />
            </Autocomplete>
          </div>
        )}
        <div className="min-w-[200px]">
          <GoogleMap
            mapContainerStyle={{
              height: '300px',
              width: '100%',
            }}
            center={{
              lat: parseFloat(lat),
              lng: parseFloat(lng),
            }}
            zoom={15}
            onClick={isEditable ? handleMapClick : undefined}
            options={{
              disableDefaultUI: !isEditable,
              draggable: isEditable,
              scrollwheel: true,
              doubleClickZoom: true,
              mapTypeControl: false,
              streetViewControl: false,
              zoomControl: true,
              fullscreenControl: false,
            }}
          >
            <Marker position={markerPosition} icon={redMarkerIcon} />
          </GoogleMap>
        </div>
      </div>
    );
  }, [
    lat,
    lng,
    isEditable,
    markerPosition,
    handlePlaceChanged,
    handleMapClick,
  ]);

  return <div>{isLoaded ? renderMap() : <div>Loading...</div>}</div>;
};

export default withAuth(GoogleMapsComponent, false, true);
