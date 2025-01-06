from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import time
import urllib.request
import urllib.error
from typing import Dict
from urllib.parse import urlparse, parse_qs

# Configuration
API_HOST = "http://localhost:8001"  # FastAPI server
CACHE_DURATION = 24 * 60 * 60  # 24 hours in seconds

# In-memory cache storage
cache: Dict[str, dict] = {}

class ProxyCacheHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        try:
            # Parse the URL
            parsed_url = urlparse(self.path)
            path = parsed_url.path
            query = parse_qs(parsed_url.query)
            
            # Create cache key from method and path
            cache_key = f"GET:{path}"
            
            # Check if we have a valid cached response
            cached_response = cache.get(cache_key)
            current_time = time.time()
            
            # Return cached response if it exists and is not expired
            if cached_response and current_time - cached_response["timestamp"] < CACHE_DURATION:
                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.send_header("X-Cache", "HIT")
                self.send_header("X-Cache-Timestamp", cached_response["timestamp_iso"])
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                self.wfile.write(json.dumps(cached_response["data"]).encode())
                return
            
            # Forward request to API server
            api_url = f"{API_HOST}{self.path}"
            try:
                with urllib.request.urlopen(api_url) as response:
                    data = json.loads(response.read().decode())
                    
                    # Cache the response
                    cache[cache_key] = {
                        "data": data,
                        "timestamp": current_time,
                        "timestamp_iso": time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime(current_time))
                    }
                    
                    # Send response to client
                    self.send_response(200)
                    self.send_header("Content-Type", "application/json")
                    self.send_header("X-Cache", "MISS")
                    self.send_header("X-Cache-Timestamp", time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime(current_time)))
                    self.send_header("Access-Control-Allow-Origin", "*")
                    self.end_headers()
                    self.wfile.write(json.dumps(data).encode())
            
            except urllib.error.HTTPError as e:
                self.send_error(e.code, e.reason)
            except urllib.error.URLError as e:
                self.send_error(503, f"Service Unavailable: {str(e)}")
        
        except Exception as e:
            self.send_error(500, f"Internal Server Error: {str(e)}")
    
    def do_POST(self):
        try:
            # Read request body
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length).decode()
            
            # Forward request to API server
            api_url = f"{API_HOST}{self.path}"
            req = urllib.request.Request(
                api_url,
                data=body.encode(),
                headers={
                    "Content-Type": "application/json"
                },
                method="POST"
            )
            
            try:
                with urllib.request.urlopen(req) as response:
                    data = response.read().decode()
                    
                    # Clear cache for GET requests to the same path
                    path_prefix = self.path.split('?')[0]
                    for key in list(cache.keys()):
                        if key.startswith(f"GET:{path_prefix}"):
                            del cache[key]
                    
                    # Send response to client
                    self.send_response(200)
                    self.send_header("Content-Type", "application/json")
                    self.send_header("Access-Control-Allow-Origin", "*")
                    self.end_headers()
                    self.wfile.write(data.encode())
            
            except urllib.error.HTTPError as e:
                self.send_error(e.code, e.reason)
            except urllib.error.URLError as e:
                self.send_error(503, f"Service Unavailable: {str(e)}")
        
        except Exception as e:
            self.send_error(500, f"Internal Server Error: {str(e)}")
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

def run_server(port=8000):
    server_address = ('', port)
    httpd = HTTPServer(server_address, ProxyCacheHandler)
    print(f"Starting proxy cache server on port {port}...")
    httpd.serve_forever()

if __name__ == "__main__":
    run_server() 