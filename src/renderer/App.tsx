import { useEffect, useState } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
//import icon from '../../assets/icon.svg';
import './App.css';
import { Broswer } from './Browser';
import { Camera, PostureState, calibrate } from './Camera';
import Welcome from './Welcome';
import Diagram, { PostureClass } from './Diagram';
import { startTime, toggleMode, addData, start } from './Output';
import Stats from './Stats';

export const SHOW_CAMERA = true;

export type InterventionMode =
  | 'off'
  | 'visual'
  | 'haptic'
  | 'all'
  | 'extreme'
  | 'paused';

export type InterventionDisplayMode = InterventionMode | 'auto' | 'test';

const CYCLE: InterventionMode[] = ['off', 'visual', 'all', 'haptic']; //ADD BACK 'all' at end when testing haptics
let cycleIndex = 0;
let cycleInterval = 1000 * 45; // 1 minute
const testInterval = 1000 * 60 * 5; //5 minutes
let cycleTimer: NodeJS.Timeout | undefined;

let landmarksLost = false;
let unPauseTimer: NodeJS.Timeout | undefined = undefined;
let lastMode: InterventionDisplayMode = 'off';

function Hello() {
  const [scale, setScale] = useState(1);
  const [transformX, setTransformX] = useState(0);
  const [transformY, setTransformY] = useState(0);
  const [isOnboarding, setIsOnboarding] = useState(true);
  const [postureState, setPostureState] = useState<PostureState | undefined>(
    undefined
  );
  const [mode, _setMode] = useState<InterventionMode>('off');
  const [displayMode, setDisplayMode] =
    useState<InterventionDisplayMode>('auto');
  const [isShowingStats, setIsShowingStats] = useState(false);

  const scheduleAutoCycleTimer = () => {
    cycleTimer = setTimeout(nextCyclePhase, cycleInterval);
  };

  const scheduleTestCycleTimer = () => {
    cycleTimer = setTimeout(testNextCycle, testInterval);
  };

  const cancelTimer = () => {
    if (cycleTimer) clearTimeout(cycleTimer);
  };

  const setMode = (m: InterventionMode) => {
    console.log('setMode:', m);
    toggleMode(m);
    _setMode(m);
  };

  const nextCyclePhase = () => {
    cycleIndex += 1;
    if (cycleIndex >= CYCLE.length) {
      cycleIndex = 0;
      // cycleInterval *= 2; // Double phase length
    }
    setMode(CYCLE[cycleIndex]);
    addData('NEXT_CYCLE');
    console.log(
      'Test Mode Change to',
      CYCLE[cycleIndex].toUpperCase(),
      '| interval =',
      cycleInterval / 1000,
      'sec'
    );
    scheduleAutoCycleTimer();
  };

  const testNextCycle = () => {
    cycleIndex += 1;
    if (cycleIndex >= CYCLE.length) {
      //TODO: trigger stats page and end test
      addData('FINISH');
      setIsShowingStats(true);
      return;
    }
    setMode(CYCLE[cycleIndex]);
    addData('NEXT_CYCLE');
    scheduleTestCycleTimer();
  };

  const onModeChange = (m: InterventionDisplayMode) => {
    console.log('onModeChange: prevMode', displayMode);
    setDisplayMode(m);
    cancelTimer();

    if (m === 'auto') {
      setMode(CYCLE[0]);
      scheduleAutoCycleTimer();
    } else if (m === 'test') {
      setMode(CYCLE[0]);
      scheduleTestCycleTimer();
    } else {
      clearTimeout(cycleTimer);
      setMode(m);
      toggleMode(m);
    }
  };

  const extremeModeActive =
    mode === 'extreme' && !isOnboarding && !isShowingStats;
  return (
    <Container
      style={
        extremeModeActive
          ? {
              transform: `scale(${scale}, ${scale}) translate(${transformX}%, ${transformY}%) scale(${scale}, ${scale})`,
              transition: 'transform 200ms ease',
            }
          : {}
      }
    >
      {isOnboarding ? (
        <Welcome
          onFinish={(m) => {
            onModeChange(m);
            setIsOnboarding(false);
            startTime();
            addData('START');
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
          showStats={() => {
            if (mode !== 'paused') addData('PAUSE');
            setIsShowingStats(true);
          }}
        />
      )}
      {isShowingStats && (
        <Stats
          hide={() => {
            setIsShowingStats(false);
            addData('RESUME');
          }}
        />
      )}

      <Camera
        isCameraPaused={isShowingStats}
        mode={mode}
        setMode={(m) => onModeChange(m)}
        cameraOpacity={
          isOnboarding
            ? 0.8
            : displayMode !== 'test' &&
              displayMode !== 'auto' &&
              displayMode !== 'all' &&
              !isShowingStats
            ? 0.5
            : 0
        }
        onUpdateState={(state: PostureState | null) => {
          if (state == null) {
            clearTimeout(unPauseTimer);
            if (!landmarksLost) {
              console.log(mode);
              landmarksLost = true;
              lastMode = displayMode;
              onModeChange('paused');
              addData('PAUSE');
            }
            return;
          } else if (landmarksLost) {
            if (!unPauseTimer) {
              unPauseTimer = setTimeout(() => {
                landmarksLost = false;
                addData('RESUME');
                // @ts-ignore
                onModeChange(lastMode);
              }, 2000);
            }
            return;
          }

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

      {!isOnboarding && !isShowingStats && (
        <Diagram
          transformX={transformX}
          transformY={transformY}
          scale={scale}
          state={postureState}
          mode={mode}
          visible={mode === 'visual' || mode === 'all'}
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
