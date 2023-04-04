import SerialPort from 'serialport';

export function sendMessage() {
  var port = 'COM12';
  var message = 'H';

  const serialPort = new SerialPort(port, {
    baudRate: 9600,
    dataBits: 8,
    stopBits: 1,
    parity: 'none',
  });

  serialPort.write(message, function (err) {
    if (err) {
      return console.log('Error on write: ', err.message);
    }
    console.log('Message sent successfully');
  });
}
