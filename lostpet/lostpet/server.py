import json
from flask import Flask, request, render_template, make_response, abort, jsonify
from model import connect_to_db_flask, db, Species, User, Breed, Color, LostPet
from datetime import datetime
from sqlalchemy import desc
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


#http://localhost:5000/lostpets/api/lostpets

# PET = [
#     {
#         "lostpet_id": 1,
#         "lostpet_name": None,
#         "species_code": "c",
#         "title": "Lost cat (male orange tabby)",
#         "description": "My cat Milo has been missing since October. We live near San Rafael highschool. If anyone has seen him or knows where he is please let me know.",
#         "datetime": "2017-02-08 17:53:37.080000",
#         "photo": "https://images.craigslist.org/00P0P_jt3Lu2CTXB8_600x450.jpg",
#         "latitude": 37.968884,
#         "longitude": -122.511903,
#         "address": " (san rafael)",
#         "url": "https://sfbay.craigslist.org/nby/laf/5995666386.html",
#     }
# ]

@app.route('/lostpets/api/lostpets.json', methods=['GET'])
def get_pets():
    """Return info about pets as JSON."""

    pets = db.session.query(LostPet)

    #lost_pet_id

    species_r = request.args.get("species_code")
    text_search = request.args.get("text_search")
    lost_pet_id = request.args.get("lost_pet_id")

    #Year-month-day
    since = request.args.get("since")
    if since:
        since = datetime.strptime(since, "%Y-%m-%d")
        pets = pets.filter(LostPet.datetime > since).order_by(desc(LostPet.datetime))

    if species_r:
        pets = pets.filter(LostPet.species_code == species_r)

    if text_search:
        pets = pets.filter(LostPet.description.ilike("%"+text_search+"%"))

    if lost_pet_id:
        pets = pets.filter(LostPet.lost_pet_id == lost_pet_id)

    pets_list = []
    for pet in pets:

        pet_dict = {
            "lostpet_id": pet.lost_pet_id,
            "lostpet_name": pet.lost_pet_name,
            "species_code": pet.species_code,
            "title": pet.title,
            "description": pet.description,
            "datetime": datetime.strftime(pet.datetime, "%Y-%m-%d"),
            "photo": pet.photo,
            "latitude": pet.latitude,
            "longitude": pet.longitude,
            "address": pet.address,
            "url": pet.url,
            "user_id": pet.user_id,
            "email": pet.email,
            "phone": pet.phone
        }
        pets_list.append(pet_dict)

    pets = {"result": pets_list}

    return jsonify(pets)


@app.route('/lostpets/api/species', methods=['GET'])
def get_species():
    """Return info about my species as JSON."""

    species = db.session.query(Species).all()

    species_list = []
    for s in species:
        #This is a filter that only show species that had lostpets associeted
        if len(s.lostpets) != 0:
            species_dict = {
                "species_code": s.species_code,
                "name": s.name
                }
            species_list.append(species_dict)

    return json.dumps(species_list, indent=4, sort_keys=True, default=str)


@app.route('/lostpets/api/lostpets', methods=['POST'])
def create_pet():
    """Create a new into de DB"""

    # print request.form

    if not request.form or not "species_code" in request.form:
        abort(400, 'if you see this the error was in the params')

    
    # import pdb; pdb.set_trace()
    species_code = request.form["species_code"]

    new_pet_name = request.form.get("name", None)
    newpet_title = request.form.get("title", None)
    newpet_description = request.form.get("description", None)

    #Year-month-day
    newpet_date = request.form.get("datetime", None)
    if newpet_date:
        newpet_date = datetime.strptime(newpet_date, "%Y-%m-%d")

    newpet_latitude = request.form.get("latitude", None)
    newpet_longitude = request.form.get("longitude", None)
    newpet_address = request.form.get("address", None)

    #gender is a string of 1 (M - F)
    newpet_gender = request.form.get("gender", None)

    newpet_user_id = None

    if not request.form.get("phone", None):
        newpet_phone = None
    else:
        newpet_phone = request.form["phone"]

    newpet_photo = request.form.get("photo", None)

    newpet_email = request.form.get("email", None)
    if newpet_email:

        new_user = User(email=newpet_email, phone=newpet_phone)

        db.session.add(new_user)
        db.session.commit()

        newpet_user_id = new_user.user_id
        newpet_email = new_user.email
        newpet_phone = new_user.phone

    newpet = LostPet(species_code=species_code,
                     lost_pet_name=new_pet_name,
                     title=newpet_title,
                     lost_pet_gender=newpet_gender,
                     description=newpet_description,
                     datetime=newpet_date,
                     latitude=newpet_latitude,
                     longitude=newpet_longitude,
                     address=newpet_address,
                     photo=newpet_photo,
                     user_id=newpet_user_id,
                     email=newpet_email,
                     phone=newpet_phone)

    db.session.add(newpet)
    db.session.commit()

    newpet_dict = {
        "lostpet_id": newpet.lost_pet_id,
        "lostpet_name": newpet.lost_pet_name,
        "species_code": newpet.species_code,
        "title": newpet.title,
        "description": newpet.description,
        "datetime": newpet.datetime,
        "latitude": newpet.latitude,
        "longitude": newpet.longitude,
        "address": newpet.address,
        "gender": newpet.lost_pet_gender,
        "photo": newpet.photo,
        "user_id": newpet.user_id,
        "email": newpet.email,
        "phone": newpet.phone
    }

    return json.dumps(newpet_dict, indent=4, sort_keys=True, default=str)


@app.errorhandler(404)
def not_found(error):
    """ Return a json with the error to be able to handle this """

    return make_response(json.dumps({'error': 'Not found'}), 404)


@app.route('/')
def show_map():
    """Show map."""

    return render_template("home.html")


if __name__ == "__main__":

    connect_to_db_flask(app)

    app.run(host='0.0.0.0', debug=True)
