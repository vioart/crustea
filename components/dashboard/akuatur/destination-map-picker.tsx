"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

type Props = {
  latitude: number | null;
  longitude: number | null;
  onChange: (latitude: number, longitude: number) => void;
};

const defaultCenter: [number, number] = [-2.5, 118];

const markerIcon = L.divIcon({
  className: "",
  html: `<div style="
    width: 28px;
    height: 28px;
    background: #05546A;
    border: 3px solid white;
    border-radius: 50% 50% 50% 0;
    transform: rotate(-45deg);
    box-shadow: 0 2px 8px rgba(0,0,0,.35);
  "></div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 28],
});

function MapClickHandler({ onChange }: { onChange: Props["onChange"] }) {
  useMapEvents({
    click(event) {
      onChange(event.latlng.lat, event.latlng.lng);
    },
  });
  return null;
}

function MapView({ latitude, longitude }: Pick<Props, "latitude" | "longitude">) {
  const map = useMapEvents({});
  const lastCenter = useRef("");

  useEffect(() => {
    if (latitude === null || longitude === null) return;
    const key = `${latitude},${longitude}`;
    if (lastCenter.current === key) return;
    lastCenter.current = key;
    map.setView([latitude, longitude], Math.max(map.getZoom(), 13));
  }, [latitude, longitude, map]);

  return null;
}

export default function DestinationMapPicker({
  latitude,
  longitude,
  onChange,
}: Props) {
  const position: [number, number] | null =
    latitude !== null && longitude !== null
      ? [latitude, longitude]
      : null;

  return (
    <div className="relative z-0 h-[320px] overflow-hidden rounded-xl border border-border">
      <MapContainer
        center={position ?? defaultCenter}
        zoom={position ? 14 : 5}
        scrollWheelZoom
        className="z-0 h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapClickHandler onChange={onChange} />
        <MapView latitude={latitude} longitude={longitude} />
        {position && (
          <Marker
            position={position}
            icon={markerIcon}
            draggable
            eventHandlers={{
              dragend(event) {
                const marker = event.target as L.Marker;
                const point = marker.getLatLng();
                onChange(point.lat, point.lng);
              },
            }}
          />
        )}
      </MapContainer>
    </div>
  );
}
