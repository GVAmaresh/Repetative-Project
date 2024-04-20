import os
import pickle
from datetime import datetime, timedelta
import json
import gdown
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from google.auth.transport.requests import Request
from googleapiclient.http import MediaFileUpload

global CLIENT_FILE_NAME, API_DRIVE, API_VERSION, SCOPES, TOKEN_FOLDER_NAME, TOKEN_FILE_PREFIX
CLIENT_FILE_NAME = "./client_secret.json"
API_DRIVE = "drive"
API_VERSION = "v3"
SCOPES = ["https://www.googleapis.com/auth/drive"]
TOKEN_FOLDER_NAME = "Token"
TOKEN_FILE_PREFIX = "token_json"

def create_service():
    return build(API_DRIVE, API_VERSION, credentials=get_credentials())

def get_credentials():
    cred = None
    pickle_file = 'credentials.pickle'

    if os.path.exists(pickle_file):
        with open(pickle_file, 'rb') as token:
            cred = pickle.load(token)

    if not cred or not cred.valid:
        if cred and cred.expired and cred.refresh_token:
            cred.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(CLIENT_FILE_NAME, SCOPES)
            cred = flow.run_local_server()

        with open(pickle_file, 'wb') as token:
            pickle.dump(cred, token)

    return cred

def create_token_drive(name="current"):
    """
    Creates or retrieves a token file from Google Drive.
    """
    service = create_service()
    token_main_folder_id, token_folder_id = check_token_main_folder(service)

    try:
        response = service.files().list(
            q=f"'{token_main_folder_id}' in parents and name contains '{TOKEN_FILE_PREFIX}'",
            spaces="drive",
            fields="files(id, name)"
        ).execute()

        list_all_files = response.get("files", [])

        for file_info in list_all_files:
            if file_info["name"].startswith(TOKEN_FILE_PREFIX):
                token_data = service.files().get_media(fileId=file_info["id"]).execute()
                existing_details = json.loads(token_data.decode("utf-8"))

                if existing_details.get(name):
                    token_id = existing_details[name]["token_file_id"]
                    url = f"https://drive.google.com/file/d/{token_id}/view?usp=sharing"
                    output = "current_token.pickle"
                    gdown.download(url=url, output=output, fuzzy=True)

                    with open(output, "rb") as cred_file:
                        creds = pickle.load(cred_file)
                        service = build(API_DRIVE, API_VERSION, credentials=creds)

                    os.remove(output)
                    return service, existing_details[name]["token_name"]
                else:
                    token_file = create_token(name, service)
                    return service, token_file

        token_file = create_token(name, service)
        return service, token_file

    except Exception as e:
        print(f"An error occurred: {str(e)}")

def create_token(name):
    """
    Creates a new token file and returns its ID.
    """
    service = create_service()
    token_main_folder_id, token_folder_id = check_token_main_folder(service)
    token_file_path = f'{name}.pickle'

    try:
        media = MediaFileUpload(token_file_path, mimetype="application/pdf")
        new_file = service.files().create(
            body={"name": name, "parents": [token_folder_id]},
            media_body=media,
            fields="id"
        ).execute()

        expiry_time = datetime.now() + timedelta(hours=24)
        expiry_str = expiry_time.strftime("%Y-%m-%dT%H:%M:%SZ")

        existing_details = {
            name: {
                "token_name": name,
                "token_file_id": new_file["id"],
                "expires_at": expiry_str
            }
        }

        save_token_details(existing_details, token_main_folder_id)
        return name

    except Exception as e:
        print(f"An error occurred: {str(e)}")

def save_token_details(details, folder_id):
    """
    Saves token details to a JSON file on Google Drive.
    """
    service = create_service()
    file_name = f"{TOKEN_FILE_PREFIX}.json"

    with open(file_name, "w", encoding="utf-8") as json_file:
        json.dump(details, json_file, ensure_ascii=False)

    media = MediaFileUpload(file_name, mimetype="application/json")
    service.files().create(
        body={"name": file_name, "parents": [folder_id]},
        media_body=media,
        fields="id"
    ).execute()

def check_token_main_folder(service):
    """
    Checks for the main token folder and creates it if it doesn't exist.
    """
    result = service.files().list(
        q="mimeType = 'application/vnd.google-apps.folder' and 'root' in parents",
        fields="files(id, name)"
    ).execute()

    token_main_folder_id = None
    token_folder_id = None

    for folder in result.get("files", []):
        if folder["name"] == TOKEN_FOLDER_NAME:
            token_main_folder_id = folder["id"]
            token_folder_id = check_token_folder(service, token_main_folder_id)
            break

    if not token_main_folder_id:
        token_main_folder = service.files().create(
            body={"name": TOKEN_FOLDER_NAME, "mimeType": "application/vnd.google-apps.folder"},
            fields="id"
        ).execute()

        token_main_folder_id = token_main_folder["id"]
        token_folder_id = check_token_folder(service, token_main_folder_id)

    return token_main_folder_id, token_folder_id

def check_token_folder(service, parent_id):
    """
    Checks for the token folder and creates it if it doesn't exist.
    """
    result = service.files().list(
        q=f"mimeType = 'application/vnd.google-apps.folder' and '{parent_id}' in parents",
        fields="files(id, name)"
    ).execute()

    token_folder_id = None

    for folder in result.get("files", []):
        if folder["name"] == TOKEN_FOLDER_NAME:
            token_folder_id = folder["id"]
            break

    if not token_folder_id:
        token_folder = service.files().create(
            body={"name": TOKEN_FOLDER_NAME, "mimeType": "application/vnd.google-apps.folder", "parents": [parent_id]},
            fields="id"
        ).execute()

        token_folder_id = token_folder["id"]

    return token_folder_id

# Main section
if __name__ == "__main__":
    service, token_name = create_token_drive()
    print("Service:", service)
    print("Token Name:", token_name)
