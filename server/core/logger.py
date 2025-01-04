import os
import logging
from datetime import datetime

from enums.environment import Environment

environment = os.getenv("ENVIRONMENT")

def load_filename():
    now = datetime.now()
    filename = f"{now.strftime("%Y-%m-%d")}.log"
    path = "logs/" + filename

    return path

def load_level():
    if (environment == Environment.dev.value):
        return logging.DEBUG
    elif (environment == Environment.prod.value):
        return logging.ERROR
    else:
        return logging.DEBUG


logging.basicConfig(
    filename=load_filename(),
    level=load_level(),
    format="%(name)s %(asctime)s %(levelname)s %(message)s"
)

logger = logging.getLogger(__name__)