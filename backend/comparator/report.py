from googleapiclient.http import MediaFileUpload, MediaIoBaseUpload
import json
import os
from io import BytesIO
import time
import io

file_metadata = {
    "name": "Fake",
    "mimeType": "application/vnd.google-apps.folder",
}
file_result = {
    "name": "Result",
    "mimeType": "application/vnd.google-apps.folder",
}
file_report = {
    "name": "Report",
    "mimeType": "application/vnd.google-apps.folder",
}


def checkFake(service, path="root", Folder_Name="Fake"):
    resource = service.files()
    result = resource.list(
        q=f"mimeType = 'application/vnd.google-apps.folder' and '{path}' in parents",
        fields="nextPageToken, files(id, name)",
    ).execute()
    list_folders = result.get("files")
    fake_folder_id = None
    result_folder_id = None
    report_folder_id = None

    for folder in list_folders:
        if folder["name"] == Folder_Name:
            fake_folder_id = folder["id"]
            break

    if not fake_folder_id:
        fake_folder = service.files().create(body=file_metadata, fields="id").execute()
        fake_folder_id = fake_folder["id"]

        # Create Result folder under Fake
        result_folder = (
            service.files()
            .create(
                body={
                    "name": "Result",
                    "mimeType": "application/vnd.google-apps.folder",
                    "parents": [fake_folder_id],
                    "type": "anyone",
                    "role": "reader",
                },
                fields="id",
            )
            .execute()
        )
        result_folder_id = result_folder["id"]

        report_folder = (
            service.files()
            .create(
                body={
                    "name": "Report",
                    "mimeType": "application/vnd.google-apps.folder",
                    "parents": [fake_folder_id],
                },
                fields="id",
            )
            .execute()
        )
        report_folder_id = report_folder["id"]

    return fake_folder_id, result_folder_id, report_folder_id


def checkRespectiveFolder(service, path="root", Folder_Name="Fake"):
    resource = service.files()
    result = resource.list(
        q=f"mimeType = 'application/vnd.google-apps.folder' and '{path}' in parents",
        fields="nextPageToken, files(id, name)",
    ).execute()
    list_folders = result.get("files")
    fake_folder_id = None
    for folder in list_folders:
        if folder["name"] == Folder_Name:
            fake_folder_id = folder["id"]
            break

    return fake_folder_id


def CheckFolders(service):
    fake_folder_id = checkFake(service)
    return "Folders created or already existed."


def AddReport(service, fileName, file):
    fake_folder_id = checkRespectiveFolder(service)
    report_folder_id = checkRespectiveFolder(
        service, path=fake_folder_id, Folder_Name="Report"
    )

    file_metadata = {"name": fileName, "parents": [report_folder_id]}
    media = MediaFileUpload(file, mimetype="application/pdf")
    newFile = (
        service.files()
        .create(body=file_metadata, media_body=media, fields="id")
        .execute()
    )
    return newFile.get("id")


def AddSummary(service, details):
    try:
        fake_folder_id = checkRespectiveFolder(service)
        result_folder_id = checkRespectiveFolder(
            service, path=fake_folder_id, Folder_Name="Result"
        )
        response = (
            service.files()
            .list(
                q="name contains 'data-'",
                spaces="drive",
                fields="files(id, name)",
            )
            .execute()
        )
        list_all_files = response["files"]
        
        is_selected = False
        file_name = ""

        for list_files in list_all_files:
            if "data" in list_files["name"][:5]:
                latest_file_id = str(list_files["id"])

                existing_data = (
                    service.files().get_media(fileId=latest_file_id).execute()
                )

                existing_details = json.loads(existing_data.decode("utf-8"))

                with open(list_files["name"], "w", encoding="utf-8") as json_file:
                    json.dump(existing_details, json_file, ensure_ascii=False)

                if len(existing_details) < 100:
                    is_selected = True
                    file_name = list_files["name"]

                    with open(file_name, "r", encoding="utf-8") as json_file:
                        existing_data = json.load(json_file)

                    existing_data.append(details)

                    with open(file_name, "w", encoding="utf-8") as json_file:
                        json.dump(existing_data, json_file)

                    json_file.close()

                    file_metadata = {"name": file_name, "parents": [result_folder_id]}
                    media = MediaFileUpload(file_name, mimetype="application/json")

                    service.files().update(
                        fileId=latest_file_id, media_body=media
                    ).execute()

                    return
            else:
                break

        if is_selected == False:
            existing_details = [details]
            file_name = f"data-{len(list_all_files) }.json"
            json_data = json.dumps(existing_details)
            with open(file_name, "w") as f:
                f.write(json_data)
            file_metadata = {"name": file_name, "parents": [result_folder_id]}
            media = MediaFileUpload(
                file_name, mimetype="application/json", resumable=True
            )
            service.files().create(
                body=file_metadata, media_body=media, fields="id"
            ).execute()
            return
        # os.remove(file_name)

    except Exception as e:
        print(f"An error occurred: {str(e)}")


def DeleteReport(service, fileName):
    fake_folder_id = checkRespectiveFolder(service)
    report_folder_id = checkRespectiveFolder(
        service, path=fake_folder_id, Folder_Name="Report"
    )
    response = (
        service.files()
        .list(
            q="mimeType='application/pdf' and '" + report_folder_id + "' in parents",
            spaces="drive",
            fields="files(id, name)",
            pageToken=None,
        )
        .execute()
    )
    for i in response["files"]:
        if i["name"] == fileName:
            file_id = i["id"]
            service.files().delete(fileId=file_id).execute()
            print(f"File with name '{fileName}' deleted successfully.")
            break
