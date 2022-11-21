import { useEffect, useRef } from "react";
import { appState, Views } from "./App";
import Panorama from "./Panorama";

const PanoramaComponent = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current) {
      const panorama = Panorama.getPanorama();
      panorama.initElement(canvasRef.current);
    }
  }, []);

  return (
    <div ref={canvasRef} className="canvas-container"></div>
    // <button onClick={() => {
    //   appState.setSelectedView(Views.MAP_VIEW);
    // }}>
    //   Panoram
    // </button>
  )
}

export default PanoramaComponent;