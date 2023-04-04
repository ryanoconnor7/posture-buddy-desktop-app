import { useState } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import icon from '../../assets/icon.svg';
import './App.css';
import { Broswer } from './Browser';
import { Camera, calibrate } from './Camera';
import Welcome from './Welcome';

function Hello() {
  const [scale, setScale] = useState(1);
  const [transformX, setTransformX] = useState(0);
  const [transformY, setTransformY] = useState(0);
  const [isOnboarding, setIsOnboarding] = useState(true);

  return (
    <Container
      style={
        !isOnboarding ?
        {
          transform: `scale(${scale}, ${scale}) translate(${transformX}%, ${transformY}%) scale(${scale}, ${scale})`,
          //transform: `scale(${scale}, ${scale})`,
          //transform: `translate(${transformX}%, ${transformY}%) scale(${scale}, ${scale})`,
        } : undefined
      }
    >
      {isOnboarding ? (
        <Welcome
          onFinish={() => {
            setIsOnboarding(false);
          }}
          onCalibrate={() => {
            calibrate();
          }}
        />
      ) : (
        <Broswer />
      )}

      <Camera
        onUpdateState={(state: any) => {

          //setTransformX(state.dxPercent * -100 * 0.7);
          //setTransformY(state.dyPercent * -100 * 0.7);
          if(state.relativeDistances != null){
            let rdlen = state.relativeDistances.length - 1;
            if(Math.abs(state.dxPercents[0] - state.dxPercents[rdlen]) > 0.1){
              setTransformX(state.dxPercents[rdlen] * -100);
            }
            if(Math.abs(state.dyPercents[0] - state.dyPercents[rdlen]) > 0.1){
              setTransformY(state.dyPercents[rdlen] * -100);
            }
            if(Math.abs(state.relativeDistances[0] - state.relativeDistances[rdlen]) > 0.05){
              setScale(state.relativeDistances[rdlen]);
            }
          }
        }}


      />
    </Container>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}

const Container = styled.div`
  background-color: black;
  width: 90vw;
  height: 90vh;
`;
