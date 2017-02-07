"""Models and database functions for LostPet db."""

import datetime
from flask_sqlalchemy import SQLAlchemy

# Here's where I create the idea of database.

db = SQLAlchemy()


##############################################################################
# Part 1: Compose ORM


class Species(db.Model):
    """Specie table for differents pets."""

    __tablename__ = "species"

    species_code = db.Column(db.String(5), primary_key=True, nullable=False)
    name = db.Column(db.String(50), nullable=False)

    def __repr__(self):
        """Provide helpful representation when printed."""

        return "<Species species_code=%s name=%s>" % (self.species_code, self.name)


class User(db.Model):
    """I will only use user_info for contact, but I thinks this enough reason to have a table."""

    __tablename__ = "users"

    user_id = db.Column(db.Integer, autoincrement=True, primary_key=True, nullable=False)
    twitter_handle = db.Column(db.String(30), nullable=True)
    email = db.Column(db.String(80), nullable=True)

    def __repr__(self):
        """Provide helpful representation when printed."""

        return "<User user_id=%s twitter_handle=%s email=%s>" % (self.user_id, self.twitter_handle, self.email)


class Breed(db.Model):
    """I feel I need a breed table diferent of the specie table because this info is different for each specie"""

    __tablename__ = "breeds"

    breed_code = db.Column(db.String(5), primary_key=True, nullable=False)
    species_code = db.Column(db.String(5), db.ForeignKey('species.species_code'), nullable=False)
    name = db.Column(db.String(80), nullable=False)

    def __repr__(self):
        """Provide helpful representation when printed."""

        return "<Breed breed_id=%s specie_code=%s name=%s>" % (self.breed_id, self.species_code, self.name)

    species = db.relationship("Species", backref=db.backref("breeds"))


#For the moment I'll work with just a field for the gender and if it's NULL is unknow
# class Gender(db.Model):
#     """I will need this little table just for know that I'm storing the right information"""

#     __tablename__ = "genders"

#     gender_code = db.Column(db.String(5), primary_key=True, unique=True, nullable=False)
#     gender_name = db.Column(db.String(20), nullable=False)
#     lost_pet_id = db.Column(db.Integer, db.ForeignKey('lostpets.lost_pet_id'), nullable=False)
#     species_code = db.Column(db.String(5), db.ForeignKey('species.species_code'), nullable=False)

#     def __repr__(self):
#         """Provide helpful representation when printed."""

#         return "<Gender gender_code=%s lost_pet_id=%s gender_name=%s species_code=%s>" % (self.gender_code, self.lost_pet_id, self.gender_name, self.species_code)

#     species = db.relationship("Species", backref=db.backref("genders"))
#     lost_pet = db.relationship("LostPet", backref=db.backref("genders"))


class Color(db.Model):
    """I feel I need a color table diferent of the specie table because this info is different for each specie"""

    __tablename__ = "colors"

    color_id = db.Column(db.Integer, autoincrement=True, primary_key=True, nullable=False)
    species_code = db.Column(db.String(5), db.ForeignKey('species.species_code'), nullable=False)
    name = db.Column(db.String(80), nullable=False)

    def __repr__(self):
        """Provide helpful representation when printed."""

        return "<Color color_id=%s species_code=%s color=%s>" % (self.breed_id, self.species_code, self.name)

    species = db.relationship("Species", backref=db.backref("colors"))


class LostPet(db.Model):
    """This is my primary table about the lost pet"""

    __tablename__ = "lostpets"

    lost_pet_id = db.Column(db.Integer, autoincrement=True, primary_key=True, nullable=False)
    lost_pet_name = db.Column(db.String(80), nullable=True)
    species_code = db.Column(db.String(5), db.ForeignKey('species.species_code'), nullable=False)
    breed_code = db.Column(db.String(5), db.ForeignKey('breeds.breed_code'), nullable=False)
    lost_pet_gender = db.Column(db.String(1), nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)
    lost_pet_color = db.Column(db.Integer, db.ForeignKey('colors.color_id'), nullable=True)
    description_tweet = db.Column(db.String(200), nullable=True)
    datetime = db.Column(db.DateTime(timezone=False), default=datetime.datetime.utcnow)
    photo = db.Column(db.String(400), nullable=True)
    location = db.Column(db.String(400), nullable=True)

    def __repr__(self):
        """Provide helpful representation when printed."""

        return "<LostPet lostpet_id=%s user_id=%s lostpet_name=%s specie_code=%s breed_code=%s lostpet_gender=%s lostpet_color=%s description=%s datetime=%s photo=%s location=%s>" % (self.lost_pet_id, self.user_id, self.lost_pet_name, self.specie_code, self.breed_code, self.lost_pet_gender, self.lost_pet_color, self.description_tweet, self.datetime, self.photo, self.location)

    species = db.relationship("Species", backref=db.backref("lostpets"))
    user = db.relationship("User", backref=db.backref("lostpets"))
    breed = db.relationship("Breed", backref=db.backref("lostpets"))
    color = db.relationship("Color", backref=db.backref("lostpets"))


class BreedPet(db.Model):
    """Many to many relationship between a pet and a breed"""

    __tablename__ = "breeds_pets"

    breed_pet_id = db.Column(db.String(5), primary_key=True, nullable=False)
    lost_pet_id = db.Column(db.Integer, db.ForeignKey('lostpets.lost_pet_id'), nullable=False)
    breed_code = db.Column(db.String(5), db.ForeignKey('breeds.breed_code'), nullable=False)
    species_code = db.Column(db.String(5), db.ForeignKey('species.species_code'), nullable=False)


class ColorPet(db.Model):
    """Many to many relationship between a pet and a color"""

    __tablename__ = "color_pets"

    color_pet_id = db.Column(db.String(5), primary_key=True, nullable=False)
    lost_pet_id = db.Column(db.Integer, db.ForeignKey('lostpets.lost_pet_id'), nullable=False)
    color_id = db.Column(db.Integer, db.ForeignKey('colors.color_id'), nullable=False)
    species_code = db.Column(db.String(5), db.ForeignKey('species.species_code'), nullable=False)




# End Part ORM


##############################################################################
# Helper functions

def init_app():
    # So that we can use Flask-SQLAlchemy, we'll make a Flask app.
    from flask import Flask
    app = Flask(__name__)

    connect_to_db(app)
    print "Connected to DB."


def connect_to_db(app):
    """Connect the database to our Flask app."""

    # Configure to use our database.
    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgres:///lostpets'
    app.config['SQLALCHEMY_ECHO'] = False
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    db.app = app
    db.init_app(app)


if __name__ == "__main__":
    # As a convenience, if we run this module interactively, it will leave
    # you in a state of being able to work with the database directly.

    # So that we can use Flask-SQLAlchemy, we'll make a Flask app.
    from flask import Flask

    app = Flask(__name__)

    connect_to_db(app)
    db.create_all()
    print "Connected to DB."
