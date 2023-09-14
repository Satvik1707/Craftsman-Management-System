export function loadGoogleMapsApi(apiKey) {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.maps) {
      resolve(window.google.maps);
    } else {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry&callback=initMap`;
      script.async = true;
      script.defer = true;
      script.onerror = (error) => {
        reject(error);
      };
      document.head.appendChild(script);

      window.initMap = () => {
        resolve(window.google.maps);
      };
    }
  });
}
