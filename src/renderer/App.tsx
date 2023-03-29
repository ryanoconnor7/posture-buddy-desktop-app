import { useState } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import icon from '../../assets/icon.svg';
import './App.css';
import { Broswer } from './Browser';
import Camera from './Camera';

function Hello() {
  const [scale, setScale] = useState(1);
  const [transformX, setTransformX] = useState(0);
  const [transformY, setTransformY] = useState(0);
  return (
    <Container
      style={{
        // transform: `scale(${scale}, ${scale}) `,
        transform: `translate(${transformX}%, ${transformY}%) scale(${scale}, ${scale})`,
      }}
    >
      <Broswer />
      <Camera
        onUpdateState={(state: any) => {
          setTransformX(state.dxPercent * -100);
          setTransformY(state.dyPercent * -100);
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
