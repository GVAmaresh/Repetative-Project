from fastapi import FastAPI
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from typing import Annotated
import shutil
from backend.api_connection.apiConnection import Create_Service
from comparator.report import AddFile, CheckFolders, AddSummary
"""
Folder Path in drive would be:
    Fake/reports
    Fake/summerized
    
"""


CLIENT_FILE_NAME = "./client_secret.json"
API_DRIVE = "drive"
API_VERSION = "v3"
SCOPES = ["https://www.googleapis.com/auth/drive"]

services = Create_Service(CLIENT_FILE_NAME, API_DRIVE, API_VERSION, SCOPES)

app = FastAPI(docs_url="/api/docs", openapi_url="/api/openapi.json")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/api/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        return JSONResponse(
            content={"message": "File uploaded successfully", "success": True}
        )
    except Exception as e:
        return JSONResponse(
            status_code=500, content={"error": str(e), "success": False}
        )


@app.get("/check")
def check():
    try:
        CheckFolders(services)
        # data = AddFile(services, "report-name", "./report.pdf")
        data = AddSummary(services, {"name": "don't kno", "room":"wanna check"})
        return JSONResponse(
            content={"message": data, "success": True}
        )
    except Exception as e:
        return JSONResponse(
            status_code=500, content={"error": str(e), "success": False}
        )



if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
