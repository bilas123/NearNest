import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { X, MapPin, Navigation, Check, Loader2 } from "lucide-react";
import { getCurrentCoordinates, getAddressFromCoords } from "../utils/location";

// Fix default Leaflet marker icon asset paths for Vite
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Default center: Kolkata (Park Street / Central)
const DEFAULT_KOLKATA = [22.5726, 88.3639];

export function LocationPickerModal({ isOpen, onClose, onSelectLocation, initialCoords }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  const [coords, setCoords] = useState(initialCoords || DEFAULT_KOLKATA);
  const [address, setAddress] = useState("Detecting location...");
  const [loadingAddr, setLoadingAddr] = useState(false);
  const [locating, setLocating] = useState(false);

  const updateAddress = async (lat, lon) => {
    setLoadingAddr(true);
    try {
      const name = await getAddressFromCoords(lat, lon);
      setAddress(name);
    } catch {
      setAddress(`Location (${lat.toFixed(2)}, ${lon.toFixed(2)})`);
    } finally {
      setLoadingAddr(false);
    }
  };

  useEffect(() => {
    if (!isOpen || !mapContainerRef.current) return;

    const timer = setTimeout(() => {
      const [lat, lon] = coords;
      const map = L.map(mapContainerRef.current).setView([lat, lon], 14);
      mapInstanceRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; OpenStreetMap',
      }).addTo(map);

      const marker = L.marker([lat, lon], { draggable: true }).addTo(map);
      markerRef.current = marker;
      updateAddress(lat, lon);

      const handleMove = (newLat, newLng) => {
        marker.setLatLng([newLat, newLng]);
        setCoords([newLat, newLng]);
        updateAddress(newLat, newLng);
      };

      map.on("click", (e) => handleMove(e.latlng.lat, e.latlng.lng));
      marker.on("dragend", () => {
        const { lat: mLat, lng: mLng } = marker.getLatLng();
        handleMove(mLat, mLng);
      });

      map.invalidateSize();
    }, 150);

    return () => {
      clearTimeout(timer);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isOpen]);

  const handleLocateMe = async () => {
    setLocating(true);
    try {
      const pos = await getCurrentCoordinates();
      if (mapInstanceRef.current && markerRef.current) {
        mapInstanceRef.current.setView([pos.latitude, pos.longitude], 15);
        markerRef.current.setLatLng([pos.latitude, pos.longitude]);
        setCoords([pos.latitude, pos.longitude]);
        updateAddress(pos.latitude, pos.longitude);
      }
    } catch {
      alert("GPS not available. Please tap on the map to pick your location.");
    } finally {
      setLocating(false);
    }
  };

  const handleConfirm = () => {
    onSelectLocation({
      address,
      coordinates: [coords[1], coords[0]], // [lon, lat] for GeoJSON
      latitude: coords[0],
      longitude: coords[1],
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative w-full max-w-xl bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-emerald-600" />
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white text-sm">Pick Location on Map</h3>
              <p className="text-[11px] text-gray-500">Tap anywhere on the map or drag the pin</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Map Container */}
        <div className="relative w-full h-80 sm:h-96 bg-gray-100">
          <div ref={mapContainerRef} className="w-full h-full" />
          <button type="button" onClick={handleLocateMe} disabled={locating}
            className="absolute top-3 right-3 z-1000 inline-flex items-center space-x-1.5 px-3 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 text-xs font-bold rounded-xl shadow-md border border-gray-200 dark:border-gray-700 cursor-pointer">
            {locating ? <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" /> : <Navigation className="w-3.5 h-3.5 text-emerald-600" />}
            <span>{locating ? "Locating..." : "Locate Me"}</span>
          </button>
        </div>

        {/* Selected Address Display & Confirmation */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50/70 dark:bg-gray-800/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex-1">
            <p className="text-[10px] uppercase font-bold text-gray-400">Selected Area</p>
            <p className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 line-clamp-1">
              {loadingAddr ? "Fetching address..." : address}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl cursor-pointer">
              Cancel
            </button>
            <button type="button" onClick={handleConfirm} className="inline-flex items-center space-x-1.5 px-5 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-md hover:bg-emerald-700 cursor-pointer">
              <Check className="w-3.5 h-3.5" />
              <span>Confirm Location</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
