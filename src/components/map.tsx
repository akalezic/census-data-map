// page.js
"use client";
import React, { useEffect, useRef, useState } from "react";
import Map, { NavigationControl, GeolocateControl, Source, Layer } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";


function MapLegend({ colorConfig }:any) {
  return (
    <div className="map-legend">
      <p className="font-semibold">Map Legend</p>
      {colorConfig.gradientArray.map((color:any, index:any) => (
        <div key={index} className="legend-item">
          <span className="legend-color" style={{ backgroundColor: color }}></span>
          <span className="legend-label">{colorConfig.interval[index] || '>'}+</span>
        </div>
      ))}
    </div>
  );
}

export default function MapboxMap({ geoJson}: any) {
	const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '';
  const [selection, setSelection] = useState('total_population');
  const [colorConfig, setColorConfig] = useState({
    interval: [1000, 10000, 50000, 100000],
    gradientArray: ['#ffeda0', '#feb24c', '#f03b20', '#3c005a', '#bd0026']
  });
  const mapRef = useRef<any>(null);

  function getBoundingBox(geoJson:any) {
    let bounds = [[Infinity, Infinity], [-Infinity, -Infinity]];
  
    geoJson.features.forEach((feature:any) => {
      feature.geometry.coordinates.forEach((coords:any) => {
        coords.forEach((coord:any) => {
          if (coord[0] < bounds[0][0]) bounds[0][0] = coord[0];
          if (coord[1] < bounds[0][1]) bounds[0][1] = coord[1];
          if (coord[0] > bounds[1][0]) bounds[1][0] = coord[0];
          if (coord[1] > bounds[1][1]) bounds[1][1] = coord[1];
        });
      });
    });
  
    return bounds;
  }

  useEffect(() => {
  }, [geoJson]);
  
  useEffect(() => {
    if (selection === 'total_population') {
      setColorConfig({
        interval: [1000, 10000, 50000, 100000, 200000],
        gradientArray: ['#ffeda0', '#feb24c', '#f03b20', '#3c005a', '#bd0026', '#808080']
      });
    } else {
      setColorConfig({
        interval: [20000, 40000, 60000, 80000, 100000],
        gradientArray: ['#7af8ff', '#0197ff', '#0139ff', '#070088', '#00194e', '#808080']
      });
    }
  }, [selection]);

  const handleLoad = (event:any) => {
    const map = event.target;

    if (geoJson && geoJson.features.length) {
      const bounds = getBoundingBox(geoJson);

      map.fitBounds(bounds, {
        padding: 20,
        maxZoom: 15,
        duration: 2000,
      });
    }
  };

	return (
    <div>
      <p className="font-semibold p-2">Select a census data category to display: </p>
      <select className="p-2 mb-2 ml-2 border-light-gray border rounded-lg" value={selection} onChange={(e) => setSelection(e.target.value)}>
        <option value="total_population">Total Population</option>
        <option value="median_household_income">Median Household Income</option>
      </select>
			<Map
        style={{width: '100%', height: '50vh'}}
        ref={mapRef}
				mapboxAccessToken={mapboxToken}
				mapStyle="mapbox://styles/mapbox/streets-v12"
				maxZoom={20}
				minZoom={3}
        onLoad={handleLoad}
			>
        {geoJson && (
          <>
            <Source id="my-geojson" type="geojson" data={geoJson}>
              <Layer
                id="my-geojson-layer"
                type="fill"
                paint={{
                  'fill-color': [
                    'case',
                    ['<', ['to-number', ['get', selection]], colorConfig.interval[0]], colorConfig.gradientArray[0],
                    ['<', ['to-number', ['get', selection]], colorConfig.interval[1]], colorConfig.gradientArray[1],
                    ['<', ['to-number', ['get', selection]], colorConfig.interval[2]], colorConfig.gradientArray[2],
                    ['<', ['to-number', ['get', selection]], colorConfig.interval[3]], colorConfig.gradientArray[3],
                    colorConfig.gradientArray[4]
                  ],
                  'fill-opacity': 0.75,
                }}
              />
                <Layer
                  id="my-geojson-line-layer"
                  type="line"
                  paint={{
                    'line-color': '#000', // Set the color of the border
                    'line-width': 0.5, // Set the width of the border
                  }}
                />
            </Source>
          </>
        )}
				<GeolocateControl position="top-left" />
				<NavigationControl position="top-left" />
			</Map>
      {geoJson && (
        <MapLegend colorConfig={colorConfig} />
      )}
    </div>
	);
}
