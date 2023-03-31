const { SerialPort } = require('serialport')
const { ByteLengthParser } = require('@serialport/parser-byte-length')

export function sendMessage() {

  var port = "COM12";
  var message = 'H';

  const serialPort = new SerialPort(
  {
    path: 'COM12',
    baudRate: 9600,
    dataBits: 8,
    stopBits: 1,
    parity: 'none',
  });

  const parser = port.pipe(new ByteLengthParser({ length: 8 }))
  parser.on('data', console.log) // will have 8 bytes per data event

  serialPort.write(message, function(err) {
    if (err) {
      return console.log("Error on write: ", err.message);
    }
    console.log("Message sent successfully");
  });
}
