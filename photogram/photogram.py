import argparse
import datetime
import json

from flask_session import Session
from flask_sqlalchemy import SQLAlchemy
from gdrive_service import GoogleDriveService
from sqlalchemy import text

from flask import (Flask, jsonify, redirect, render_template, request, session,
                   url_for)

app = Flask(__name__)
app.config.from_file("/run/secrets/config_file", load=json.load)
db = SQLAlchemy(app)
Session(app)
gdrive = GoogleDriveService().build()
images = []


class Vote(db.Model):
    # primary key: vote id
    id = db.Column(db.Integer, primary_key=True)
    # foregin key: file_id
    file_id = db.Column(db.String(50), db.ForeignKey('images.file_id'))
    ip = db.Column(db.String(50), nullable=False)
    user_agent = db.Column(db.String(70))
    timestamp = db.Column(
        db.DateTime(timezone=True), default=datetime.datetime.now
    )


class Images(db.Model):
    # primary key
    file_id = db.Column(db.String(100), nullable=False, primary_key=True)
    # number of votes received
    votes = db.Column(db.Integer, default=0)


@app.route("/all")
def all_files():
    return {
        "files": get_image_list_meta()
    }


@app.route("/vote/<file_id>", methods=["GET", "POST"])
def register_vote(file_id):
    vote = Vote(file_id=file_id, ip=str(request.remote_addr),
                user_agent=str(request.user_agent))
    db.session.add(vote)
    db.session.commit()
    # count the vote in Images DB
    image = Images.query.filter_by(file_id=file_id).first()
    image.votes += 1
    db.session.commit()
    return jsonify({
        "file_id": file_id,
        "ip": vote.ip,
        "timestamp": vote.timestamp,
        "user_agent": str(request.user_agent)
    }), 200


@app.route("/next-meta")
def get_random_image_url():
    if not session.get("count") or session["count"] >= len(images):
        session["count"] = 0
    file_id = images[session["count"]]
    session["count"] = session["count"] + 1
    return jsonify({
        "src": file_id
    })


@app.route("/")
def render_cards():
    return render_template("cards.html")


@app.route("/gallery")
def render_gallery():
    return render_template("gallery.html")


@app.route("/topk/<count>", methods=["GET"])
def fetch_topk_images(count):
    result = db.engine.execute(
        text(f"select * from images order by votes DESC LIMIT {count}"))
    data = []
    for row in result:
        data.append({
            "file_id": row[0],
            "votes": row[1]
        })
    return jsonify(data), 200


def get_image_list_meta():
    # by default gdrive api returns the first 100 results
    # we can set the page size from 1 to 1000
    list_file = gdrive.files().list(pageSize=999).execute()
    # filter files based on type
    return [file_ for file_ in list_file.get("files")
            if "image" in file_["mimeType"]]


def init_db(images):
    for im in set(images):
        # check if file exists in db
        result = Images.query.filter_by(file_id=im)
        if not result.all():
            image = Images(file_id=im)
            db.session.add(image)
    db.session.commit()


# create a list of image urls
images = [f["id"] for f in get_image_list_meta()]
# initialize database
with app.app_context():
    db.create_all()
    init_db(images)

if __name__ == "__main__":
    # parser = argparse.ArgumentParser()
    # parser.add_argument("--init", action="store_true")
    # args = parser.parse_args()
    app.run(host="0.0.0.0", debug=True)