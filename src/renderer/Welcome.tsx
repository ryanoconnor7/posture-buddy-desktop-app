import { useState } from 'react';
import styled from 'styled-components';
import { sendMessage } from './Haptics';

const Welcome = (props: { onFinish: () => void; onCalibrate: () => void }) => {
  const [stage, setStage] = useState(0);

  const nextStage = () => {
    if (stage < 1) {
      sendMessage();
      // setStage(stage + 1);
    } else if (stage === 5) {
      props.onFinish();
    } else {
      // Start timer
      setStage(2);
      setTimeout(() => setStage(3), 1000);
      setTimeout(() => setStage(4), 2000);
      setTimeout(() => setStage(5), 3000);
      setTimeout(() => props.onCalibrate(), 3000);
    }
  };

  return (
    <Container>
      <PostureBuddyLogo>PostureBuddy Browser</PostureBuddyLogo>
      <Content>
        {stage === 0 ? (
          <>
            <h1 style={{ fontSize: 60 }}>Welcome</h1>
            <h1>PostureBuddy, a browser designed to keep you moving.</h1>
          </>
        ) : stage === 1 ? (
          <>
            <div>
              <Info />
            </div>
            <h1>First, we need to calibrate.</h1>
            <h2 style={{ fontWeight: '400' }}>
              Get comfortable in the position you will be browing.
            </h2>
            <h2 style={{ fontWeight: '400' }}>
              You'll have 3 seconds to get ready
              <br />
              once you click calibrate.
            </h2>
          </>
        ) : stage < 5 ? (
          <h1 style={{ textAlign: 'center', fontSize: 200 }}>{5 - stage}</h1>
        ) : (
          <>
            <Checkmark />
            <h1 style={{ textAlign: 'center' }}>Calibrated</h1>
          </>
        )}
      </Content>
      {(stage < 2 || stage === 5) && (
        <StartButton onClick={nextStage}>
          {stage === 5 ? 'START' : stage === 0 ? 'BEGIN' : 'CALIBRATE'}
          <ArrowForward />
        </StartButton>
      )}
    </Container>
  );
};

export default Welcome;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 98vh;
  width: 96vw;
  background-color: white;
  padding: 0px 16px;
`;
const Content = styled.div`
  padding: 0px 20%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  flex-grow: 1;
  margin-bottom: 18%;
`;
const PostureBuddyLogo = styled.h2`
  background: linear-gradient(0.25turn, #e66465, 25%, #9198e5);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;
const StartButton = styled.p`
  border-radius: 12px;
  background-color: #9198e5;
  color: white;
  padding: 12px;
  position: absolute;
  right: 24px;
  bottom: 16px;
  font-size: 24px;
  font-weight: 500;
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
`;
const ArrowForward = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
    height="26"
    style={{ marginLeft: 8 }}
  >
    <path
      fill="none"
      stroke="white"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="60"
      d="M268 112l144 144-144 144M392 256H100"
    />
  </svg>
);

const Info = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" height="60">
    <path
      d="M248 64C146.39 64 64 146.39 64 248s82.39 184 184 184 184-82.39 184-184S349.61 64 248 64z"
      fill="none"
      stroke="currentColor"
      stroke-miterlimit="10"
      stroke-width="32"
    />
    <path
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="32"
      d="M220 220h32v116"
    />
    <path
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-miterlimit="10"
      stroke-width="32"
      d="M208 340h88"
    />
    <path d="M248 130a26 26 0 1026 26 26 26 0 00-26-26z" />
  </svg>
);

const Checkmark = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="136" viewBox="0 0 512 512">
    <path
      d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192z"
      fill="none"
      stroke="green"
      stroke-miterlimit="10"
      stroke-width="40"
    />
    <path
      fill="none"
      stroke="green"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="40"
      d="M352 176L217.6 336 160 272"
    />
  </svg>
);
