import io
import os

from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from googleapiclient.http import MediaIoBaseDownload
from oauth2client.service_account import ServiceAccountCredentials


class GoogleDriveService:
    def __init__(self):
        self._SCOPES = ['https://www.googleapis.com/auth/drive']

        _base_path = os.path.dirname(__file__)
        # _credential_path = os.path.join(_base_path, 'secret.json')
        _credential_path = "/run/secrets/secure_key"
        os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = _credential_path

    def build(self):
        creds = ServiceAccountCredentials.from_json_keyfile_name(
            os.getenv("GOOGLE_APPLICATION_CREDENTIALS"), self._SCOPES)
        service = build('drive', 'v3', credentials=creds)

        return service

    def download(self, file_id):
        try:
            request = self.files().get_media(fileId=file_id)
            file = io.BytesIO()
            downloader = MediaIoBaseDownload(file, request)
            done = False
            while done is False:
                status, done = downloader.next_chunk()
                print(F'Download {int(status.progress() * 100)}.')
        except HttpError as error:
            print(F'An error occurred: {error}')
            file = None

        return file.getvalue()


# if __name__ == "__main__":
#     gdrive = GoogleDriveService().build()
#     list_of_files = gdrive.files().list(pageSize=999).execute()['files']
#     print(len(list_of_files))
