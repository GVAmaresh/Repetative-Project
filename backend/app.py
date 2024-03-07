from fastapi import FastAPI
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from typing import Annotated
import os
import shutil
from api_connection.apiConnection import Create_Service
from comparator.report import (
    AddReport,
    CheckFolders,
    DeleteReport,
)

from comparator.summerized import AddSummary, DeleteSummary, Get_All_Reports

from api_connection.apiConnection import removeAccount
import uuid
from comparator.text_summerizer.summerize2 import Summerized_Text
from comparator.extract.extract import extract_text_from_pdf

from comparator.compareSummerized import compareText

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
                "drive": f"https://drive.google.com/file/d/{report_id}/view?usp=sharing",
                "year": "2023",
                "category": ["wanna check"],
            },
        )
        try:
            directory = "."
            for filename in os.listdir(directory):
                if filename.startswith("data-"):
                    file_path = "./" + filename
                    os.remove(file_path)
        except Exception as e:
            print(f"An error occurred: {str(e)}")
        return JSONResponse(
            content={
                "message": "Successfully added Report and Summary",
                "success": True,
            }
        )
    except Exception as e:
        return JSONResponse(
            status_code=500, content={"error": str(e), "success": False}
        )


@app.get("/api/delete")
async def delete_file():
    try:
        report_name = "64794277-3c81-4dc0-9b65-03fe9698b9dc"
        DeleteSummary(services, report_name)
        DeleteReport(services, report_name)
        try:
            directory = "."
            for filename in os.listdir(directory):
                if filename.startswith("data-"):
                    file_path = "./" + filename
                    os.remove(file_path)
        except Exception as e:
            print(f"An error occurred: {str(e)}")
        return JSONResponse(
            content={
                "message": "Successfully Deleted Summary and Report",
                "success": True,
            }
        )
    except Exception as e:
        return JSONResponse(
            status_code=500, content={"error": str(e), "success": False}
        )


@app.delete("/api/logout")
async def delete_account():
    removeAccount()


@app.get("/api/getReports")
async def get_reports():
    try:
        data = Get_All_Reports(services)
        try:
            directory = "."
            for filename in os.listdir(directory):
                if filename.startswith("data-"):
                    file_path = "./" + filename
                    os.remove(file_path)
        except Exception as e:
            print(f"An error occurred: {str(e)}")
        return JSONResponse(
            content={
                "message": data,
                "success": True,
            }
        )
    except Exception as e:
        return JSONResponse(
            status_code=500, content={"error": str(e), "success": False}
        )


@app.get("/api/compare")
async def compare():
    try:
        summary = "Parkinson's disease (PD) is a chronic, degenerative disorder of the central nervous system that predominantly impacts human motor function. Individuals with PD often experience recurrent falls, which can lead to severe consequences, including fatalities or critical situations. To address this, we have proposed a solution that detects patient falls and promptly notifies caretakers or family members through messages, calls, or alarms, thus helping prevent tragic outcomes.",
        data = compareText(
            services,
            summary
        )
        try:
            directory = "."
            for filename in os.listdir(directory):
                if filename.startswith("data-"):
                    file_path = "./" + filename
                    os.remove(file_path)
        except Exception as e:
            print(f"An error occurred: {str(e)}")
        return JSONResponse(
            content={
                "summary": summary,
                "compare": data,
                "success": True,
            }
        )
    except Exception as e:
        return JSONResponse(
            status_code=500, content={"error": str(e), "success": False}
        )


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
