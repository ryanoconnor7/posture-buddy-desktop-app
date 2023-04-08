import { PostureClass } from './Diagram';

const HAPTICS_HOST = 'http://localhost:8888';

// Motor: [1, n]
// Power [1, 100]

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

export function updateHaptics(props: {
  transformX: number;
  transformY: number;
  postureClass: PostureClass;
  scale: number;
}) {
  const newPowers = lastSentPowers.map((oldPower, motorIndex) => {
    if (props.postureClass === 'fair') {
      return 50;
    } else if (props.postureClass === 'bad') {
      return 100;
    } else {
      return 0;
    }
  });

  newPowers.forEach((power, i) => {
    if (power !== lastSentPowers[i]) {
      sendMessage({ motor: i, power });
    }
  });

  lastSentPowers = newPowers;
}
