## Py Cache

This is a simple cache system for Python. It is designed to be used in a webapp (/frontend)

### Frontend

Next app to display cache status, recent products, and add products.

- Next.js
- TailwindCSS
- Lucide Icons
- Shadcn UI

### Server

Python server to handle requests and cache.

- FastAPI
- Caching Proxy

### Setup & Running

1. Create and activate a Python virtual environment:

```bash
python3 -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
```

2. Install server dependencies:

```bash
cd server
make install
```

3. Start the API server (in one terminal):

```bash
make run-api
```

4. Start the proxy cache server (in another terminal):

```bash
make run-proxy
```

The system will be running with:

- Frontend making requests to the proxy (port 8000)
- Proxy caching GET requests and forwarding to the API (port 8001)
- Cache invalidation happening when new products are added
- Cache status being tracked and displayed in the UI
