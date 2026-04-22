from fastapi import FastAPI

app = FastAPI(title="HAIBAZO Book Review API")


@app.get("/")
def health_check():
    return {"status": "ok"}
