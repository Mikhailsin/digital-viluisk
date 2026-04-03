from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import json, random


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

with open("data/objects_vilyuysk.geojson", encoding="utf-8") as f:
    objects = json.load(f)

with open("data/sensors.json", encoding="utf-8") as f:
    sensors = json.load(f)

@app.get("/api/objects")
def get_objects():
    return objects

@app.get("/api/sensors")
def get_sensors():
    result = []
    for s in sensors:
        s_copy = s.copy()
        s_copy["value"] = round(s["value"] + random.uniform(-1, 1), 1)
        result.append(s_copy)
    return result

@app.get("/api/sensors/{sensor_id}/history")
def get_history(sensor_id: int):
    for s in sensors:
        if s["id"] == sensor_id:
            return {"id": sensor_id, "history": s["history"]}
    return {"error": "not found"}