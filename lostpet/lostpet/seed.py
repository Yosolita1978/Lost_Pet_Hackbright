
"""Utility file to seed lostpets database data in the columns Species, Breeds and Colors."""

from sqlalchemy import func
from model import Species, User, Breed, Color, LostPet
from model import connect_to_db_flask, db


def load_species():
    """Load species into database."""

    print "Species"

    dog = Species(name="dog", species_code="d")
    cat = Species(name="cat", species_code="c")
    other = Species(name="other", species_code="o")

    # We need to add to the session or it won't ever be stored
    db.session.add(dog)
    db.session.add(cat)
    db.session.add(other)

    # Once we're done, we should commit our work
    db.session.commit()


def load_breed():
    """Load breeds into database."""

    print "Breeds"

    for line in open("u.breeds"):
        line = line.strip()
        row = line.split("|")
        #print row
        breed_code, species_code, name = row

        if species_code == "d":
            dog = Breed(breed_code=breed_code, species_code=species_code, name=name)
            db.session.add(dog)
        elif species_code == "c":
            cat = Breed(breed_code=breed_code, species_code=species_code, name=name)
            db.session.add(cat)

    # Once we're done, we should commit our work
    db.session.commit()

def load_colors():
    """Load colors into database."""

    print "Colors"

    for line in open("u.colorbreeds"):
        line = line.strip()
        row = line.split("|")
        #print row
        species_code, name = row

        if species_code == "d":
            color = Color(species_code=species_code, name=name)

        elif species_code == "c":
            color = Color(species_code=species_code, name=name)

        db.session.add(color)

    # Once we're done, we should commit our work
    db.session.commit()

if __name__ == "__main__":
    from flask import Flask

    app = Flask(__name__)

    connect_to_db_flask(app)
    #db.create_all()
    print "Connected to DB."

    # Import different types of species, and breeds for each.
    load_species()
    load_breed()
    load_colors()
