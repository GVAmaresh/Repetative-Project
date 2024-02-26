from googleapiclient.http import MediaFileUpload,MediaIoBaseUpload
import json
import os

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
    for folder in list_folders:
        if folder["name"] == Folder_Name:
            fake_folder_id = folder["id"]
            break

    if not fake_folder_id:
        fake_folder = service.files().create(body=file_metadata, fields="id").execute()
        fake_folder_id = fake_folder["id"]

    return fake_folder_id

def CheckFolders(service):
    fake_folder_id = checkFake(service)
    report_folder_id = checkFake(service, path=fake_folder_id, Folder_Name="Report")
    result_folder_id = checkFake(service, path=fake_folder_id, Folder_Name="Result")

    return "Folders created or already existed."

def AddFile(service, fileName, file):
    fake_folder_id = checkFake(service)
    report_folder_id = checkFake(service, path=fake_folder_id, Folder_Name="Report")

    file_metadata = {"name": fileName, "parents": [report_folder_id]}
    media = MediaFileUpload(file, mimetype="application/pdf")
    newFile = (
        service.files()
        .create(body=file_metadata, media_body=media, fields="id")
        .execute()
    )
    return newFile.get("id")


def AddSummary(service, details):
    fake_folder_id = checkFake(service)
    report_folder_id = checkFake(service, path=fake_folder_id, Folder_Name="Result")
    resource = service.files()
    result = resource.list(
        q=f"'{report_folder_id}' in parents",
        fields="nextPageToken, files(id, name)",
    ).execute()
    list_files = result.get("files")
    if list_files:
        latest_file = list_files[-1]
        latest_file_id = latest_file["id"]

        existing_data = service.files().get_media(fileId=latest_file_id).execute()
        existing_data = existing_data.decode('utf8').replace("'", '"')
        existing_details = json.loads(existing_data)
        
        if len(existing_details) < 100:
            existing_details.extend(details)
            updated_data = json.dumps(existing_details)
            print(existing_details)
            print(updated_data)
            media = MediaFileUpload(updated_data, mimetype="application/json", resumable=True, delimiter=",")  
            service.files().update(fileId=latest_file_id, media_body=media).execute()
            return  
        else:
            return
    else:
        existing_details = [details]
        file_name = f'data-1.json'
        json_data = json.dumps(existing_details)
        with open(file_name, 'w') as f:
            f.write(json_data)
        file_metadata = {"name": file_name, "parents": [report_folder_id]} 
        media = MediaFileUpload(file_name, mimetype="application/json", resumable=True) 
        new_file = (
            service.files()
            .create(body=file_metadata, media_body=media, fields="id")
            .execute()
        )






def DeleteReportSummary(service, fileName):
    fake_folder_id = checkFake(service)
    report_folder_id = checkFake(service, path=fake_folder_id, Folder_Name="Report")
    result_folder_id = checkFake(service, path=fake_folder_id, Folder_Name="Result")

    response = service.files().list(
        q="mimeType='image/jpeg' and '" + report_folder_id + "' in parents",
        spaces="drive",
        fields="files(id, name)",
        pageToken=None
    ).execute()

    file_ids = [file.get("id") for file in response.get("files", []) if file.get("name") == fileName]
    list(map(lambda file_id: service.files().delete(fileId=file_id).execute(), file_ids))

    print(f"Files with name '{fileName}' deleted successfully.")
    
    response = service.files().list(
        q="mimeType='image/jpeg' and '" + report_folder_id + "' in parents",
        spaces="drive",
        fields="files(id, name)",
        pageToken=None
    ).execute()