import json
from flask import Flask, request, render_template
from model import connect_to_db_flask, db, Species, User, Breed, Color, LostPet

app = Flask(__name__)


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
#         "neighborhood": " (san rafael)",
#         "url": "https://sfbay.craigslist.org/nby/laf/5995666386.html",
#     }
# ]


@app.route('/lostpets/api/lostpets', methods=['GET'])
def get_pets():
    """Return info about pets as JSON."""

    pets = db.session.query(LostPet)

    species_r = request.args.get("species_code")
    text_search = request.args.get("text_search")

    if species_r:
        pets = pets.filter(LostPet.species_code == species_r)

    if text_search:
        pets = pets.filter(LostPet.description.ilike("%% %s %%" % (text_search)))

    pets_list = []
    for pet in pets:
        pet_dict = {
            "lostpet_id": pet.lost_pet_id,
            "lostpet_name": pet.lost_pet_name,
            "species_code": pet.species_code,
            "title": pet.title,
            "description": pet.description,
            "datetime": pet.datetime,
            "photo": pet.photo,
            "latitude": pet.latitude,
            "longitude": pet.longitude,
            "neighborhood": pet.neighborhood,
            "url": pet.url,
            "user_id": pet.user_id,
        }
        pets_list.append(pet_dict)

    return json.dumps(pets_list, indent=4, sort_keys=True, default=str)


if __name__ == "__main__":

    connect_to_db_flask(app)
    
    app.run(debug=True)
