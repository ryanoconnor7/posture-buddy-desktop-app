import { useEffect, useState } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import icon from '../../assets/icon.svg';
import './App.css';
import { Broswer } from './Browser';
import { Camera, PostureState, calibrate } from './Camera';
import Welcome from './Welcome';
import Diagram, { PostureClass } from './Diagram';
import { startTime, toggleControl, CSVdata } from './Output';
import Stats from './Stats';

export const SHOW_CAMERA = true;

export type InterventionMode = 'off' | 'visual' | 'haptic' | 'all' | 'auto';

const CYCLE: InterventionMode[] = ['off', 'visual', 'all'];
let cycleIndex = 0;
let cycleInterval = 1000 * 15; // 1 minute
let cycleTimer: NodeJS.Timeout | undefined;

function Hello() {
  const [scale, setScale] = useState(1);
  const [transformX, setTransformX] = useState(0);
  const [transformY, setTransformY] = useState(0);
  const [isOnboarding, setIsOnboarding] = useState(true);
  const [postureState, setPostureState] = useState<PostureState | undefined>(
    undefined
  );
  const [mode, setMode] = useState<InterventionMode>('off');
  const [displayMode, setDisplayMode] = useState<InterventionMode>('auto');
  const [isShowingStats, setIsShowingStats] = useState(false);

  const scheduleCycleTimer = () => {
    cycleTimer = setTimeout(nextCyclePhase, cycleInterval);
  };
  const nextCyclePhase = () => {
    cycleIndex += 1;
    if (cycleIndex >= CYCLE.length) {
      cycleIndex = 0;
      cycleInterval *= 2; // Double phase length
    }
    setMode(CYCLE[cycleIndex]);
    console.log(
      'Auto Mode Change to',
      CYCLE[cycleIndex].toUpperCase(),
      '| interval =',
      cycleInterval / 1000,
      'sec'
    );
    scheduleCycleTimer();
  };

  const onModeChange = (m: InterventionMode) => {
    setDisplayMode(m);

    if (m === 'auto') {
      setMode(CYCLE[0]);
      scheduleCycleTimer();
    } else {
      clearTimeout(cycleTimer);
      setMode(m);
    }
  };

  useEffect(() => {
    if (displayMode === 'auto') scheduleCycleTimer();
  }, []);

  return (
    <Container>
      {isOnboarding ? (
        <Welcome
          onFinish={() => {
            setIsOnboarding(false);
          }}
          onCalibrate={() => {
            calibrate();
            startTime();
          }}
        />
      ) : (
        <Broswer
          mode={displayMode}
          setMode={(m) => onModeChange(m)}
          showStats={() => setIsShowingStats(true)}
        />
      )}
      {isShowingStats && <Stats hide={() => setIsShowingStats(false)} />}

      <Camera
        isPaused={isShowingStats}
        mode={mode}
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

      {!isOnboarding &&
        (mode === 'visual' || mode === 'all') &&
        !isShowingStats && (
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
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Hello />} />
        </Routes>
      </Router>
    </div>
  );
}

const Container = styled.div`
  background-color: black;
  height: 97.5vh;
  width: 99.25vw;
  transition: opacity 500ms ease-in;
`;
