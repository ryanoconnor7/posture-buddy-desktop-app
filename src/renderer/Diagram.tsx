import styled from 'styled-components';
import { PostureState } from './Camera';
import Person from './assets/Person';
import { TransitionGroup } from 'react-transition-group';
import { useEffect, useState } from 'react';
import moment from 'moment';
import { transitionCSS } from './Utils';

export type PostureClass = 'good' | 'fair' | 'bad';

interface Posture {
  class: PostureClass;
  colorClass: PostureClass;
  candidateClass: PostureClass;
  timestamp: number;
}

const postureClassColor = {
  good: '#34c759',
  fair: '#F2A900',
  bad: '#ff3b30',
};

// Delay in seconds before switching to this class
const postureClassDelay = {
  good: 2,
  fair: 0,
  bad: 7,
};

const Diagram = (props: {
  transformX: number;
  transformY: number;
  scale: number;
  state?: PostureState;
}) => {
  if (!props.state) return null;

  const { scale, transformX, transformY } = props;
  const [posture, setPosture] = useState<Posture>({
    class: 'good',
    colorClass: 'good',
    candidateClass: 'good',
    timestamp: 0,
  });

  useEffect(() => {
    let newPostureClass: PostureClass = 'good';
    let scale_sensitivity = 2
    let scale_error = scale_sensitivity * (Math.abs(scale*100) - 100)
    const errorRate = Math.max(
      Math.abs(transformX),
      Math.abs(transformY),
      Math.abs(scale_error)
    );
    if (errorRate > 25) {
      newPostureClass = 'bad';
    } else if (errorRate > 12.5) {
      newPostureClass = 'fair';
    }

    // Make copy of posture state
    let newPosture: Posture = { ...posture };
    if (newPostureClass !== newPosture.colorClass)
      newPosture.colorClass = newPostureClass;

    if (newPostureClass !== posture.candidateClass) {
      // let colorClass = posture.class;
      // if (newPostureClass === 'good' && posture.class !== 'good') {
      //   colorClass = 'fair';
      // }

      newPosture.candidateClass = newPostureClass;
      newPosture.timestamp = moment().unix();
    } else if (newPostureClass !== posture.class) {
      let requiredDelay = postureClassDelay[newPostureClass]; // seconds
      if (posture.class === 'bad' && newPostureClass !== 'good') return;

      if (moment().unix() - posture.timestamp > requiredDelay) {
        newPosture.class = newPostureClass;
        newPosture.colorClass = newPostureClass;
      }
    }

    setPosture(newPosture);
  }, [props.state]);

  return (
    <Overlay
      style={{
        backgroundColor: posture.class === 'bad' ? '#00000070' : undefined,
      }}
    >
      <Container
        style={{
          bottom: posture.class === 'bad' ? '50%' : 24,
          right: posture.class === 'bad' ? '50%' : 24,
          height: posture.class === 'bad' ? 500 : 160,
          transform: `translate(${posture.class === 'bad' ? '50%' : '0%'}, ${
            posture.class === 'bad' ? '50%' : '0%'
          })`,
          opacity: posture.class === 'good' ? 0.7 : 1.0,
        }}
      >
        <HorizontalLine />
        <VerticalLine />
        <Person size={'50%'} color={'#78788066'} style={{}} />
        <Person
          size={'50%'}
          color={postureClassColor[posture.colorClass]}
          style={{
            position: 'absolute',
            transform: `scale(${scale}, ${scale}) translate(${
              transformX * -1
            }%, ${transformY * -1}%) scale(${scale}, ${scale})`,
            transition: 'transform 200ms ease',
          }}
        />
      </Container>
    </Overlay>
  );
};

export default Diagram;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  align-items: center;
  justify-content: center;
  display: flex;
  transition: background-color 500ms ease-in;
  pointer-events: none;
  ${transitionCSS('background-color 500ms ease-in')};
`;

const Container = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1;
  background-color: white;
  border-radius: 36px;
  box-shadow: 0px 12px 24px #00000070;
  overflow: hidden;
  ${transitionCSS('all 650ms ease')}
`;

const HorizontalLine = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  right: 50%;
  background-color: #c6c6c8ff;
  width: 5px;
`;
const VerticalLine = styled.div`
  position: absolute;
  top: 50%;
  bottom: 50%;
  left: 0;
  right: 0;
  background-color: #c6c6c8ff;
  height: 5px;
`;
