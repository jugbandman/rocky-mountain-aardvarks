import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet with bundlers
const customIcon = new Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

interface Location {
    id: number;
    name: string;
    address: string;
    lat: number | null;
    lng: number | null;
}

interface LeafletMapProps {
    locations: Location[];
    className?: string;
    onLocationClick?: (location: Location) => void;
}

// Denver center coordinates
const DENVER_CENTER: [number, number] = [39.7392, -104.9903];

export function LeafletMap({ locations, className = "", onLocationClick }: LeafletMapProps) {
    const validLocations = locations.filter(l => l.lat && l.lng);

    // Calculate center based on locations or default to Denver
    const center: [number, number] = validLocations.length > 0
        ? [
            validLocations.reduce((sum, l) => sum + (l.lat || 0), 0) / validLocations.length,
            validLocations.reduce((sum, l) => sum + (l.lng || 0), 0) / validLocations.length
        ]
        : DENVER_CENTER;

    return (
        <MapContainer
            center={center}
            zoom={11}
            className={`w-full h-[400px] md:h-[500px] rounded-3xl ${className}`}
            scrollWheelZoom={false}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {validLocations.map((location) => (
                <Marker
                    key={location.id}
                    position={[location.lat!, location.lng!]}
                    icon={customIcon}
                    eventHandlers={{
                        click: () => onLocationClick?.(location)
                    }}
                >
                    <Popup>
                        <div className="font-sans">
                            <h3 className="font-bold text-primary mb-1">{location.name}</h3>
                            <p className="text-gray-600 text-sm mb-2">{location.address}</p>
                            <a
                                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(location.address)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline text-sm font-medium"
                            >
                                Get Directions →
                            </a>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}
