from fastapi import FastAPI
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from typing import Annotated
import os
import shutil
from typing import List
from pydantic import BaseModel
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


class IDRequest(BaseModel):
    ids: List[str]


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
        # print(file)
        CheckFolders(services)
        summerized_id = str(uuid.uuid4())
        file_contents = await file.read()
        # print(file_contents)
        path = f"./delete/{file.filename}"
        with open(path, "wb") as f:
            f.write(file_contents)
        # print("Running upload")
        text = extract_text_from_pdf(path)
        summary = Summerized_Text(text)
        report_id = AddReport(services, summerized_id, path)
        AddSummary(
            services,
            {
                "id": summerized_id,
                "project": "",
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
                if filename.startswith("delete"):
                    file_path = path
                    os.remove(file_path)
        except Exception as e:
            print(f"An error occurred: {str(e)}")
        print("Uploaded Successfully")
        return JSONResponse(
            content={
                "message": "Successfully added Report and Summary",
                "data": {
                    "id": summerized_id,
                    "compare": "",
                    "title": "",
                    "summary": summary,
                    "drive": f"https://drive.google.com/file/d/{report_id}/view?usp=sharing",
                    "year": "2023",
                    "category": ["wanna check"],
                },
                "success": True,
            }
        )
    except Exception as e:
        return JSONResponse(
            status_code=500, content={"error": str(e), "success": False}
        )


@app.post("/api/delete")
async def delete_files(request: IDRequest):
    try:
        for report_name in request.ids:
            print(report_name)
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
        raise HTTPException(status_code=500, detail={"error": str(e), "success": False})


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
                "data": data,
                "success": True,
            }
        )
    except Exception as e:
        return JSONResponse(
            status_code=500, content={"error": str(e), "success": False}
        )


@app.post("/api/compare")
async def compare(file: UploadFile = File(...)):
    try:
        CheckFolders(services)
        summerized_id = str(uuid.uuid4())
        file_contents = await file.read()
        # print(file_contents)
        path = f"./delete/{file.filename}"
        with open(path, "wb") as f:
            f.write(file_contents)
        # print("Running upload")
        text = extract_text_from_pdf(path)
        summary = Summerized_Text(text)
        path = f"./delete/{file.filename}"
        print("Finished 2")
        with open(path, "wb") as f:
            f.write(file_contents)
        print("Finished")
        data = compareText(services, summary)
        print("Running 3")
        try:
            directory = "."
            for filename in os.listdir(directory):
                if filename.startswith("data-"):
                    file_path = "./" + filename
                    os.remove(file_path)
                if filename.startswith("delete"):
                    file_path = path
                    os.remove(file_path)
        except Exception as e:
            print(f"An error occurred: {str(e)}")
        print("Running 4")
        return JSONResponse(
            content={
                "summary": summary,
                "data": data,
                "success": True,
            }
        )
    except Exception as e:
        return JSONResponse(
            status_code=500, content={"error": str(e), "success": False}
        )


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
