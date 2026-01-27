"use client";

import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";
import { useState } from "react";
import { travelsSchema, TravelLocation } from "@/lib/schemas";
import travelsData from "@/data/travels.json";

// Higher resolution map with better country definition
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json";

const { travels } = travelsSchema.parse(travelsData);

export default function TravelMap() {
  const [hoveredLocation, setHoveredLocation] = useState<TravelLocation | null>(
    null
  );

  return (
    <div className="relative w-full">
      <div className="overflow-hidden rounded-lg border border-border bg-gradient-to-b from-sky-100 to-sky-200 dark:from-slate-900 dark:to-slate-800">
        <ComposableMap
          projectionConfig={{
            scale: 147,
            center: [0, 20],
          }}
          className="h-[300px] w-full sm:h-[400px]"
        >
          <ZoomableGroup>
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="#d4d4d4"
                    stroke="#a3a3a3"
                    strokeWidth={0.5}
                    className="dark:fill-neutral-700 dark:stroke-neutral-600"
                    style={{
                      default: { outline: "none" },
                      hover: {
                        outline: "none",
                        fill: "#a3a3a3",
                      },
                      pressed: { outline: "none" },
                    }}
                  />
                ))
              }
            </Geographies>
            {travels.map((location) => (
              <Marker
                key={location.id}
                coordinates={location.coordinates}
                onMouseEnter={() => setHoveredLocation(location)}
                onMouseLeave={() => setHoveredLocation(null)}
              >
                {location.current ? (
                  <>
                    <circle
                      r={5}
                      fill="rgba(34, 197, 94, 0.4)"
                      className="animate-ping"
                    />
                    <circle
                      r={3.5}
                      fill="#22c55e"
                      stroke="#ffffff"
                      strokeWidth={1.5}
                      className="cursor-pointer"
                    />
                  </>
                ) : (
                  <circle
                    r={2.5}
                    fill="#ef4444"
                    stroke="#ffffff"
                    strokeWidth={1}
                    className="cursor-pointer transition-transform hover:scale-150"
                  />
                )}
              </Marker>
            ))}
          </ZoomableGroup>
        </ComposableMap>
      </div>

      {/* Tooltip */}
      {hoveredLocation && (
        <div className="pointer-events-none absolute left-1/2 top-4 -translate-x-1/2 rounded-md bg-popover px-3 py-2 text-sm font-medium text-popover-foreground shadow-md">
          {hoveredLocation.city}, {hoveredLocation.country}
          {hoveredLocation.current && (
            <span className="ml-2 text-green-500">(Current)</span>
          )}
        </div>
      )}

      {/* Location list */}
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {travels.map((location) => (
          <span
            key={location.id}
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              location.current
                ? "bg-green-500/20 text-green-600 dark:text-green-400"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {location.city}, {location.country}
            {location.current && " (Current)"}
          </span>
        ))}
      </div>
    </div>
  );
}
