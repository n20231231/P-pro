import http.server
import socketserver
import os

PORT = 3000
DIRECTORY = os.path.join(os.path.dirname(__file__), "2-체험용-샘플")

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    httpd.serve_forever()
