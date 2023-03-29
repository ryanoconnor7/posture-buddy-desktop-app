import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import icon from '../../assets/icon.svg';
import './App.css';
import { Broswer } from './Browser';
import Camera from './Camera';

function Hello() {
  const scale = 0.75;
  const transformX = 100;
  const transformY = 100;
  return (
    <Container
      style={{
        transform: `scale(${scale}, ${scale}) `,
      }}
    >
      <Broswer />
      <Camera />
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
