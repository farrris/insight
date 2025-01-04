import os
import logging
import pytz
from datetime import datetime

tz = pytz.timezone("Europe/Moscow")

logger = logging.getLogger(__name__)

environment = os.getenv("ENVIRONMENT")

level = logging.INFO if environment == "prod" else logging.DEBUG

logger.setLevel(level)

now = datetime.now()

filename = f"{now.strftime("%Y-%m-%d")}.log"
path = "logs/" + filename

handler = logging.FileHandler(path)
formatter = logging.Formatter("%(name)s %(asctime)s %(levelname)s %(message)s")

handler.setFormatter(formatter)

logger.addHandler(handler)