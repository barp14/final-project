from fastapi import FastAPI
from app.controllers import router
from app.rabbitmq_consumer import start_all_consumers
import asyncio

app = FastAPI()

@app.get("/health")
async def health():
    return {"status": "Record-API is Healthy"}

@app.on_event("startup")
async def startup_event():
    asyncio.create_task(start_all_consumers())

app.include_router(router)
