import { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import { LatLng, LeafletMouseEvent, LocationEvent, Popup } from "leaflet";
import { appState, Views } from "./App";

type TMarker = {
  id?: string,
  lat: number,
  lng: number,
  img: string
}

const fakeMarker = {
  id: "kdnvkdnksnmvklnk",
  lat: 60.180986,
  lng: 24.831762,
  img: "haha"
}

const fakeMarkers = [fakeMarker];

const MouseDebug = () => {
  const [position, setPosition] = useState<LatLng | null>(null)
  const map = useMapEvents({
    mousemove(e: LeafletMouseEvent) {
      setPosition(e.latlng)
    },
    click(e: LeafletMouseEvent) {
      console.log(e.latlng)
    }
    // locationfound(e: LocationEvent) {
    //   setPosition(e.latlng)
    //   map.flyTo(e.latlng, map.getZoom())
    // },
  })

  return position === null ? null : (
    <div className="mouse-debug-container">
      {position.lat.toFixed(4) + " " + position.lng.toFixed(4)}
    </div>
  )
}

const Markers = () => {
  const [markers, setMarkers] = useState(fakeMarkers)

  

  return (
    <>
      {markers.map(marker => {
        return (
          <ClickableMarker key={marker.id} lat={marker.lat} lng={marker.lng} img={marker.img}/>
        )
      })}
    </>
  )
}



const ClickableMarker = (props: TMarker) => {
  const eventHandlers = useMemo(
    () => ({
      click(e: LeafletMouseEvent) {
        console.log(props.img);
        appState.setSelectedView(Views.PANORAMA_VIEW);
      },
    }),
    [],
  )

  return (
    <Marker
      position={new LatLng(props.lat, props.lng)}
      eventHandlers={eventHandlers}>

    </Marker>
  )
}

const MapComponent = () => {
  const mapRef = useRef(null);

  // useEffect(() => {
  //   const mapDiv = mapRef.current;
  //   console.log(mapDiv);
  // }, []);

  return (
    <MapContainer center={[60.1811, 24.8317]} zoom={20} scrollWheelZoom={true} style={{height: "100%", position: "relative"}}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MouseDebug />
      <Markers />
    </MapContainer>
  )
}

export default MapComponent;