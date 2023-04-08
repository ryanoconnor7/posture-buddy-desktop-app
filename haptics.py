# Python 3 server example
from http.server import BaseHTTPRequestHandler, HTTPServer
import time
from urllib.parse import urlparse, parse_qs

hostName = "localhost"
serverPort = 8888

class MyServer(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Content-Type", "text/plain")
        self.end_headers()
        parsed = urlparse(self.path)
        self.wfile.write(bytes("Echo path: " + parsed.path + ", query: " + parsed.query, "utf-8"))
        
        if parsed.path == "control":
            power = parsed.query.power
            motor = parsed.query.motor
            print("Set MOTOR " + motor + " to POWER " + power)

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