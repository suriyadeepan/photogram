from datetime import datetime


def gdrive_time_format(ts):
    return datetime.strptime(ts, "%Y:%m:%d %H:%M:%S")


def sqlite_time_format(dt):
    return datetime.strftime(dt, "%Y-%m-%d %H:%M:%S")