from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, List, Optional
import time

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage
products: Dict[int, dict] = {
    1: {"id": 1, "name": "Laptop", "description": "High-performance laptop", "price": 999.99, "category": "Electronics", "manufacturer": "TechCo", "in_stock": True},
    2: {"id": 2, "name": "Smartphone", "description": "Latest smartphone", "price": 699.99, "category": "Electronics", "manufacturer": "PhoneCo", "in_stock": True},
    3: {"id": 3, "name": "Headphones", "description": "Wireless headphones", "price": 199.99, "category": "Audio", "manufacturer": "AudioCo", "in_stock": True},
    4: {"id": 4, "name": "Coffee Maker", "description": "Automatic coffee maker", "price": 79.99, "category": "Appliances", "manufacturer": "HomeCo", "in_stock": True},
    5: {"id": 5, "name": "Backpack", "description": "Durable backpack", "price": 49.99, "category": "Accessories", "manufacturer": "BagCo", "in_stock": True},
}

# Cache storage
cache: Dict[str, dict] = {}
CACHE_DURATION = 24 * 60 * 60  # 24 hours in seconds

class Product(BaseModel):
    name: str
    description: str
    price: float
    category: str
    manufacturer: Optional[str] = ""
    in_stock: bool = True

@app.get("/products")
async def get_products():
    return list(products.values())

@app.get("/products/recent")
async def get_recent_products(limit: int = 5):
    sorted_products = sorted(products.values(), key=lambda x: x["id"], reverse=True)
    return sorted_products[:limit]

@app.post("/products")
async def create_product(product: Product):
    # Get the next available ID
    next_id = max(products.keys(), default=0) + 1
    
    # Create new product with ID
    new_product = {
        "id": next_id,
        **product.dict()
    }
    
    # Add to storage
    products[next_id] = new_product
    
    # Clear cache entries for products endpoints
    for key in list(cache.keys()):
        if key.startswith("GET:/products"):
            del cache[key]
    
    return new_product

@app.post("/cache/clear")
async def clear_cache():
    cache.clear()
    return {"message": "Cache cleared successfully"}

@app.get("/cache/status")
async def get_cache_status():
    return {
        "size": len(cache),
        "entries": [{"key": k, "timestamp": v.get("timestamp")} for k, v in cache.items()]
    } 