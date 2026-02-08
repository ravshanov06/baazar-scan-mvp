import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// Helper to create colored markers using SVG
const createCustomIcon = (color) => {
    return L.divIcon({
        className: 'custom-marker',
        html: `
            <div style="
                background-color: ${color};
                width: 24px;
                height: 24px;
                border-radius: 50% 50% 50% 0;
                transform: rotate(-45deg);
                border: 3px solid white;
                box-shadow: 0 4px 6px rgba(0,0,0,0.3);
            "></div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 24],
        popupAnchor: [0, -24]
    });
};

const iconColors = {
    blue: '#3b82f6',   // Default / All
    green: '#22c55e',  // Cheap
    yellow: '#eab308', // Average
    red: '#ef4444'     // Expensive
};

// Component to update map view when center changes. Skip setView when map is already at this center (e.g. after user drag) to avoid flicker.
const MapUpdater = ({ center, zoom }) => {
    const map = useMap();
    useEffect(() => {
        if (!center || !Array.isArray(center) || center.length < 2) return;
        const current = map.getCenter();
        const [lat, lng] = center;
        const epsilon = 1e-6;
        if (Math.abs(current.lat - lat) < epsilon && Math.abs(current.lng - lng) < epsilon) return;
        map.setView(center, zoom);
    }, [center, zoom, map]);
    return null;
};

// Component to update map events and center tracking
const MapEvents = ({ onCenterChange }) => {
    const map = useMap();
    useEffect(() => {
        if (!onCenterChange) return;

        const handleMove = () => {
            const center = map.getCenter();
            onCenterChange([center.lat, center.lng]);
        };

        map.on('moveend', handleMove);
        return () => map.off('moveend', handleMove);
    }, [map, onCenterChange]);
    return null;
};

const Map = ({ center = [41.2995, 69.2401], zoom = 13, markers = [], onMarkerClick, onCenterChange, height = "100%" }) => {
    return (
        <MapContainer
            center={center}
            zoom={zoom}
            style={{ height: height, width: "100%", zIndex: 0 }}
            zoomControl={false}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapUpdater center={center} zoom={zoom} />
            <MapEvents onCenterChange={onCenterChange} />

            {Array.isArray(markers) && markers
                .filter((m) => m != null && m.lat != null && m.lon != null && Number.isFinite(m.lat) && Number.isFinite(m.lon))
                .map((marker, idx) => {
                const color = marker.color && iconColors[marker.color] ? iconColors[marker.color] : iconColors.blue;
                const icon = createCustomIcon(color);

                return (
                    <Marker
                        key={marker.id ?? idx}
                        position={[marker.lat, marker.lon]}
                        icon={icon}
                        eventHandlers={{
                            click: () => onMarkerClick && onMarkerClick(marker),
                        }}
                    >
                        <Popup>
                            <div className="font-sans min-w-[150px]">
                                <h3 className="font-black text-gray-900 border-b pb-1 mb-2">{marker.name}</h3>
                                <div className="space-y-1">
                                    {/* FIX 2: Add Array.isArray check for products */}
                                    {Array.isArray(marker.products) && marker.products.length > 0 ? (
                                        marker.products.slice(0, 5).map((p, i) => (
                                            <div key={i} className="flex justify-between text-xs">
                                                <span className="text-gray-600 font-medium capitalize">{p.name}:</span>
                                                <span className="font-bold text-primary">{p.price} so'm</span>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-xs text-gray-400 italic">Ma'lumotlar yo'q</p>
                                    )}
                                    {Array.isArray(marker.products) && marker.products.length > 5 && (
                                        <p className="text-[10px] text-center text-gray-400 pt-1">+ yana {marker.products.length - 5} ta</p>
                                    )}
                                </div>
                                {marker.distance && (
                                    <div className="mt-2 pt-1 border-t flex justify-between items-center">
                                        <span className="text-[10px] uppercase font-bold text-gray-400">Masofa</span>
                                        <span className="text-[10px] font-black text-gray-600">{marker.distance.toFixed(1)} km</span>
                                    </div>
                                )}
                            </div>
                        </Popup>
                    </Marker>
                );
            })}
        </MapContainer>
    );
};

export default Map;