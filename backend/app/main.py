from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def root():
    return {"message": "Hello Legal AI"}

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "backend"}
