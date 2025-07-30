import uvicorn
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Create FastAPI app
app = FastAPI(
    title="RoTrust API",
    description="API for RoTrust - A blockchain-based platform for real estate transactions in Romania",
    version="0.1.0",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Import routers
from app.routers import properties, transactions, users, auth

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(properties.router, prefix="/api/properties", tags=["Properties"])
app.include_router(transactions.router, prefix="/api/transactions", tags=["Transactions"])

@app.get("/", tags=["Root"])
async def root():
    """
    Root endpoint that returns basic API information.
    """
    return {
        "message": "Welcome to RoTrust API",
        "version": "0.1.0",
        "documentation": "/docs",
    }

@app.get("/health", tags=["Health"])
async def health_check():
    """
    Health check endpoint to verify API is running.
    """
    return {"status": "healthy"}

if __name__ == "__main__":
    # Get port from environment variable or use default
    port = int(os.getenv("PORT", 8000))
    
    # Run the application
    uvicorn.run("backend.main:app", host="0.0.0.0", port=port, reload=True)