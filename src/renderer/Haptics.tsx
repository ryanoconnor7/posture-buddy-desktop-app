import { FAIR_ERROR_RATE, BAD_ERROR_RATE, PostureClass } from './Diagram';

const HAPTICS_HOST = 'http://localhost:8888';

// Motor: [0, 5]
// Power [0, 255]

interface MotorAction {
  motor: number;
  power: number;
}

export async function sendMessage(action: MotorAction) {
  const actionStr = `control?motor=${action.motor}&power=${action.power}`;
  const url = `${HAPTICS_HOST}/${actionStr}`;

  try {
    const res = await fetch(url, {
      method: 'GET',
    });
    const data = await res.text();
    console.log('Haptic action', action, 'response:', res, ', data:', data);
  } catch (e) {
    console.log('Haptic action', action, 'failed with error:', e);
  }
}

let lastSentPowers = [0, 0, 0, 0, 0, 0];

function scaleRange (input: number, inMin: number, inMax: number, outMin: number, outMax: number): number {
  return (input - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

export function updateHaptics(props: {
  transformX: number;
  transformY: number;
  postureClass: PostureClass;
  scale_error: number;
}) {
  let newPowers = [0, 0, 0, 0, 0, 0];
  //motor indexes are as follows (as arranged on the chair):
  // 0 1
  // 2 3
  // 4 5
  if(props.postureClass === 'fair'){
    //Scale the range of distances to motor's strength range
    //range of absolute value for transformX is FAIR_ERROR_RATE to BAD_ERROR_RATE
    let powerX: number = scaleRange(Math.abs(props.transformX), FAIR_ERROR_RATE, BAD_ERROR_RATE, 150, 255);
    let powerY: number = scaleRange(Math.abs(props.transformX), FAIR_ERROR_RATE, BAD_ERROR_RATE, 150, 255);
    let powerScale: number = scaleRange(Math.abs(props.scale_error), FAIR_ERROR_RATE, BAD_ERROR_RATE, 150, 255);

    //if we are to the right, activate 1, 3, and 5
    if(props.transformX > FAIR_ERROR_RATE){
      newPowers[0] = powerX;
      newPowers[2] = powerX;
      newPowers[4] = powerX;
    }
    //if we are to the left, activate -1, -3, and -5
    else if(props.transformX < -FAIR_ERROR_RATE){
      newPowers[1] = powerX;
      newPowers[3] = powerX;
      newPowers[5] = powerX;
    }
    //if we are too high, activate 0 and 1. Want max power requested
    if(props.transformY > FAIR_ERROR_RATE){
      newPowers[0] = Math.max(powerY);
      newPowers[1] = Math.max(powerY);
    }
    //if we are too low, activate 4 and 5
    else if(props.transformY < -FAIR_ERROR_RATE){
      newPowers[4] = Math.max(powerY);
      newPowers[5] = Math.max(powerY);
    }
    //if we are too far, activate 0 and 1
    if(props.scale_error > FAIR_ERROR_RATE){
      newPowers[4] = Math.max(newPowers[0], powerScale);
      newPowers[5] = Math.max(newPowers[1], powerScale);
    }
    //if we are too close, activate 4 and 5
    else if(props.scale_error < -FAIR_ERROR_RATE){
      newPowers[0] = Math.max(newPowers[4], powerScale);
      newPowers[1] = Math.max(newPowers[5], powerScale);
    }
  } else if (props.postureClass === 'bad') {
    newPowers.forEach((power, i) => {
      newPowers[i] = 255;
    });
  } else if (props.postureClass === 'good') {
    newPowers.forEach((power, i) => {
      newPowers[i] = 0;
    });
  }

  // const newPowers = lastSentPowers.map((oldPower, motorIndex) => {
  //   //virtual positions of the motors
  //   let motorPositions: [number, number][] = [
  //     [-FAIR_ERROR_RATE, FAIR_ERROR_RATE],
  //     [FAIR_ERROR_RATE, FAIR_ERROR_RATE],
  //     [-FAIR_ERROR_RATE, 0],
  //     [0, FAIR_ERROR_RATE],
  //     [-FAIR_ERROR_RATE, -FAIR_ERROR_RATE],
  //     [FAIR_ERROR_RATE, -FAIR_ERROR_RATE],
  //   ];
  //   if (props.postureClass === 'fair') {


  //     //calculate hypotenuse from transformX and transformY to motor


  //     //if far enough away just go max power on all motors. "I am angry" -The chair
  //   } else if (props.postureClass === 'bad') {
  //     return 255;
  //   } else {
  //     return 0;
  //   }
  // });

  newPowers.forEach((power, i) => {
    if (power !== lastSentPowers[i]) {
      sendMessage({ motor: i, power });
    }
  });

  lastSentPowers = newPowers;
}
