# Python 3 server example
from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import urlparse, parse_qs
import serial
import time

hostName = "localhost"
serverPort = 8888

ARDUINO_PORT = "COM12"
BAUD_RATE = 115200

ser = serial.Serial(ARDUINO_PORT, BAUD_RATE)

class MyServer(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Content-Type", "text/plain")
        self.end_headers()
        parsed = urlparse(self.path)
        print("vvvvvvvv PARSED BELOW vvvvv")
        # print(parsed)
        parsed2 = parse_qs(parsed.query) # prints {'other': ['some'], 'parameter': ['value']}
        print(parsed2)
        # self.wfile.write(bytes("Echo path: " + parsed.path + ", query: " + parsed.query, "utf-8"))

        if parsed.path == "/control":
            # print("Path: " + parsed.path + " || Power: " + parsed2['power'] + " || motor: "  + parsed2['motor'])
            # print(parsed2['power'])
            # print(parsed2['motor'])
            powers = parsed2['powers'][0]
            # print("Set POWERS to " + str(powers))
            motor_message = str(powers) + ">"
            print(motor_message)
            motor_message = motor_message.encode("utf-8")
            print(repr(motor_message))
            print("waiting for ack...")
            ser.write(motor_message)

            #wait until serial is available
              #do stuff until message is received from arduino

            handshake = ser.readline()
            if(handshake != b'ack\n'):
                print("OH GOD NO WHY THE PAIN AHHHHHHH I DIDNT RECEIVE ACK INSTEAD I RECEIVED WHATS BELOW")
                print(handshake)
                quit()
            else:
                print("Got ack!")

            self.wfile.write(bytes("Echo path: " + parsed.path + ", query: " + parsed.query, "utf-8"))




if __name__ == "__main__":
    webServer = HTTPServer((hostName, serverPort), MyServer)
    webServer.allow_reuse_address = True
    print("Server started http://%s:%s" % (hostName, serverPort))

    try:
        webServer.serve_forever()
    except KeyboardInterrupt:
        pass
    except:
        print("unable to start server")

    webServer.server_close()
    print("Server stopped.")
