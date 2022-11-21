import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import MapComponent from './MapComponent'
import { makeAutoObservable } from 'mobx'
import { observer } from 'mobx-react-lite'
import PanoramaComponent from './PanoramaComponent'

export enum Views {
  MAP_VIEW,
  PANORAMA_VIEW
}

class AppState {
  selectedView = Views.PANORAMA_VIEW;

  constructor() {
      makeAutoObservable(this)
  }

  setSelectedView = (newSelectedView: Views) => {
      this.selectedView = newSelectedView;
  }
}

export const appState = new AppState();

const App = observer(() => {
  const [count, setCount] = useState(0)

  return (
    <>
      {appState.selectedView === Views.MAP_VIEW &&
        <MapComponent />
      }
      {appState.selectedView === Views.PANORAMA_VIEW &&
        <PanoramaComponent />
      }
    </>
  )
});

export default App
