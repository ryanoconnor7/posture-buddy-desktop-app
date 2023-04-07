import { useEffect, useState } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import icon from '../../assets/icon.svg';
import './App.css';
import { Broswer } from './Browser';
import { Camera, PostureState, calibrate } from './Camera';
import Welcome from './Welcome';
import Diagram, { PostureClass } from './Diagram';

export const SHOW_CAMERA = true;

function Hello() {
  const [scale, setScale] = useState(1);
  const [transformX, setTransformX] = useState(0);
  const [transformY, setTransformY] = useState(0);
  const [isOnboarding, setIsOnboarding] = useState(true);
  const [postureState, setPostureState] = useState<PostureState | undefined>(
    undefined
  );

  // useEffect(() => {
  //   calibrate();
  // }, []);

  return (
    <Container
      style={{
        ...(!isOnboarding
          ? {
              // transform: `scale(${scale}, ${scale}) translate(${transformX}%, ${transformY}%) scale(${scale}, ${scale})`,
              //transform: `scale(${scale}, ${scale})`,
              //transform: `translate(${transformX}%, ${transformY}%) scale(${scale}, ${scale})`,
            }
          : {}),
        // opacity: postureClass === 'bad' ? 0.5 : 1,
      }}
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
        onUpdateState={(state: PostureState) => {
          setPostureState(state);
          //setTransformX(state.dxPercent * -100 * 0.7);
          //setTransformY(state.dyPercent * -100 * 0.7);
          if (state.relativeDistances && state.dyPercents && state.dxPercents) {
            let rdlen = state.relativeDistances.length - 1;
            if (
              Math.abs(state.dxPercents[0] - state.dxPercents[rdlen]) > 0.05
            ) {
              setTransformX(state.dxPercents[rdlen] * -100);
            }
            if (
              Math.abs(state.dyPercents[0] - state.dyPercents[rdlen]) > 0.05
            ) {
              setTransformY(state.dyPercents[rdlen] * -100);
            }
            if (
              Math.abs(
                state.relativeDistances[0] - state.relativeDistances[rdlen]
              ) > 0.05
            ) {
              setScale(state.relativeDistances[rdlen]);
            }
          }
        }}
      />

      {!isOnboarding && (
        <Diagram
          transformX={transformX}
          transformY={transformY}
          scale={scale}
          state={postureState}
        />
      )}
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
  height: 98vh;
  width: 97vw;
  transition: opacity 500ms ease-in;
`;
