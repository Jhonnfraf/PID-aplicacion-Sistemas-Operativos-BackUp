from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],  # para Angular
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.get("/procesos")
def get_procesos():
    return [
        {"pid": 1001, "nombre": "firefox", "estado": "Ejecutando", "prioridad": 0},
        {"pid": 1002, "nombre": "vscode", "estado": "Listo", "prioridad": -5},
        {"pid": 1003, "nombre": "chrome", "estado": "Bloqueado", "prioridad": 2},
    ]