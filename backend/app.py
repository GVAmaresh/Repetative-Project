from fastapi import FastAPI
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from typing import Annotated
import os
import shutil
from api_connection.apiConnection import Create_Service
from comparator.report import AddReport, CheckFolders, AddSummary, DeleteReport
from api_connection.apiConnection import removeAccount
import uuid
from comparator.text_summerizer.summerize2 import Summerized_Text
from comparator.extract.extract import extract_text_from_pdf

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

@app.get("/api/upload")
async def upload_file():
    try:
        CheckFolders(services)
        summerized_id = str(uuid.uuid4())
        path = "./delete/report.pdf"
        text = extract_text_from_pdf(path)
        summary = Summerized_Text(text)
        report_id = AddReport(services, summerized_id, path)
        AddSummary(
            services,
            {
                "id": summerized_id,
                "summary": summary,
                "drive":f"https://drive.google.com/file/d/{report_id}/view?usp=sharing",
                "year": "2023",
                "category": ["wanna check"],
            },
        )
        try:
            directory = "." 
            for filename in os.listdir(directory):
                if filename.startswith("data-"):
                    file_path = "./"+ filename
                    os.remove(file_path)
        except Exception as e:
            print(f"An error occurred: {str(e)}")
        return JSONResponse(content={"message": "Successfully added Report and Summary", "success": True})
    except Exception as e:
        return JSONResponse(
            status_code=500, content={"error": str(e), "success": False}
        )


@app.post("/api/delete")
async def delete_file(file: UploadFile = File(...)):
    try:
        data = DeleteReport(services, "report-name")
        return JSONResponse(content={"message": data, "success": True})
    except Exception as e:
        return JSONResponse(
            status_code=500, content={"error": str(e), "success": False}
        )


## delete it##

# @app.get("/check/delete")
# async def check():
#     try:
#         data = DeleteReport(services, "report-new")
#         return JSONResponse(
#             content={"message": data, "success": True}
#         )
#     except Exception as e:
#         return JSONResponse(
#             status_code=500, content={"error": str(e), "success": False}
#         )


######
@app.delete("/api/logout")
async def delete_account():
    removeAccount()


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
