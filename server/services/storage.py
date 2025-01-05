from fastapi import UploadFile, File
from fastapi.exceptions import HTTPException
import uuid

def upload_file(file: UploadFile = File(None)):

    if (file is None):
        return None

    try:
        contents = file.file.read()
        extension = file.filename.split(".")[-1]
        filename = uuid.uuid4().hex + "." + extension
        path = "media/" + filename
        with open(path, 'wb') as f:
            f.write(contents)
    except Exception:
        raise HTTPException(status_code=500, detail='Ошибка загрузки файла')
    finally:
        file.file.close()

    return filename

    