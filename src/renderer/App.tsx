import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import icon from '../../assets/icon.svg';
import './App.css';
import { Broswer } from './Browser';

function Hello() {
  return (
    <div
      style={{
        backgroundColor: 'green',
        flex: 1,
        marginBottom: 1000,
      }}
    >
      <Broswer />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Broswer />} />
      </Routes>
    </Router>
  );
}
