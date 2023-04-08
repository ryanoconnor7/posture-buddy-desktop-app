const HAPTICS_HOST = 'http://localhost:8888';

// Motor: [1, n]
// Power [1, 100]
export async function sendMessage(motor: number, power: number) {
  const action = `control?motor=${motor}&power=${power}`;
  const url = `${HAPTICS_HOST}/${action}`;

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
