"""Models and database functions for LostPet db."""


from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import datetime

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
    phone = db.Column(db.String(20), nullable=True)
    email = db.Column(db.String(80), nullable=True)

    def __repr__(self):
        """Provide helpful representation when printed."""

        return "<User user_id=%s phone=%s email=%s>" % (self.user_id, self.phone, self.email)


class Breed(db.Model):
    """I feel I need a breed table diferent of the specie table because this info is different for each specie"""

    __tablename__ = "breeds"

    breed_code = db.Column(db.String(5), primary_key=True, nullable=False)
    species_code = db.Column(db.String(5), db.ForeignKey('species.species_code'), nullable=False)
    name = db.Column(db.String(80), nullable=False)

    def __repr__(self):
        """Provide helpful representation when printed."""

        return "<Breed breed_code=%s specie_code=%s name=%s>" % (self.breed_code, self.species_code, self.name)

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

        return "<Color color_id=%s species_code=%s color=%s>" % (self.color_id, self.species_code, self.name)

    species = db.relationship("Species", backref=db.backref("colors"))


class LostPet(db.Model):
    """This is my primary table about the lost pet"""

    __tablename__ = "lostpets"

    lost_pet_id = db.Column(db.Integer, autoincrement=True, primary_key=True, nullable=False)
    lost_pet_name = db.Column(db.String(80), nullable=True)
    species_code = db.Column(db.String(5), db.ForeignKey('species.species_code'), nullable=False)
    breed_code = db.Column(db.String(5), db.ForeignKey('breeds.breed_code'), nullable=True)
    lost_pet_gender = db.Column(db.String(1), nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=True)
    lost_pet_color = db.Column(db.Integer, db.ForeignKey('colors.color_id'), nullable=True)
    description = db.Column(db.String(1500), nullable=True)
    datetime = db.Column(db.TIMESTAMP, default=datetime.datetime.now())
    photo = db.Column(db.String(400), nullable=True)
    latitude = db.Column(db.String(400), nullable=True)
    longitude = db.Column(db.String(400), nullable=True)
    address = db.Column(db.String(400), nullable=True)
    url = db.Column(db.String(400), nullable=True)
    title = db.Column(db.String(400), nullable=True)
    phone = db.Column(db.String(20), nullable=True)
    email = db.Column(db.String(80), nullable=True)

    def __repr__(self):
        """Provide helpful representation when printed."""

        return (u"<LostPet lostpet_id=%s lostpet_name=%s species_code=%s title=%s, description=%s datetime=%s photo=%s latitude=%s, longitude=%s, address=%s, phone=%s, email=%s, url=%s>" % (self.lost_pet_id,
                                                                                                                                                                                              self.lost_pet_name,
                                                                                                                                                                                              self.species_code,
                                                                                                                                                                                              self.title,
                                                                                                                                                                                              self.description,
                                                                                                                                                                                              self.datetime,
                                                                                                                                                                                              self.photo,
                                                                                                                                                                                              self.latitude,
                                                                                                                                                                                              self.longitude,
                                                                                                                                                                                              self.address,
                                                                                                                                                                                              self.phone,
                                                                                                                                                                                              self.email,
                                                                                                                                                                                              self.url)).encode('utf-8')

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




#     #Add sample Users
#     user_test1 = User(email="badhombre@example.com", phone="")
#     user_test2 = User(email="nastywoman@example.com", phone="5552367431")
#     user_test3 = User(email="", phone="5554261000")

#     db.session.add_all([user_test1, user_test2, user_test3])
#     db.session.commit()

#     #Add sample of Breed
#     lab_test = Breed(breed_code="lab", species_code="d", name="Labrador")
#     box_test = Breed(breed_code="box", species_code="d", name="Boxer")
#     coon_test = Breed(breed_code="coon", species_code="c", name="Maine Coon")
#     sia_test = Breed(breed_code="sia", species_code="c", name="Siameses")

#     db.session.add_all([lab_test, box_test, coon_test, sia_test])
#     db.session.commit()

#     #Add sample of Lost Pets
#     linda = LostPet(species_code=dog_test,
#                     lost_pet_name="Linda",
#                     title="I lost my labrador partner",
#                     lost_pet_gender="F",
#                     description="Please help me find my pet. She is a puppy",
#                     datetime="2017-02-14 22:30:45+00",
#                     latitude=37.7651614,
#                     longitude=-122.4601482,
#                     address="Inner Sunset",
#                     photo=None,
#                     user_id=user_test1.user_id,
#                     email=user_test1.email,
#                     phone=user_test1.phone)

#     tobias = LostPet(species_code=dog_test,
#                      lost_pet_name="Tobias",
#                      title="I lost my boxer. Two years old",
#                      lost_pet_gender="M",
#                      description="Please help me find my dog. He is my best friend",
#                      datetime="2017-02-01 17:51:43.235000",
#                      latitude=37.78526,
#                      longitude=-122.411953,
#                      address="Tenderloin",
#                      photo=None,
#                      user_id=user_test2.user_id,
#                      email=user_test2.email,
#                      phone=user_test2.phone)

#     krysta = LostPet(species_code=cat_test,
#                      lost_pet_name="Krysta",
#                      title="My cat run away from home",
#                      lost_pet_gender="F",
#                      description="Please help me find my calico maine cat",
#                      datetime="2017-02-10 11:08:51.067000",
#                      latitude=37.7958617,
#                      longitude=-122.3945241,
#                      address="Pacific Heights",
#                      photo=None,
#                      user_id=user_test3.user_id,
#                      email=user_test3.email,
#                      phone=user_test3.phone)

#     patitas = LostPet(species_code=cat_test,
#                       lost_pet_name="Patitas",
#                       title="My cat is missing. Help me",
#                       lost_pet_gender="M",
#                       description="Please help me find my five years old cat",
#                       datetime="2017-02-16 14:27:36.182000",
#                       latitude=37.7960949,
#                       longitude=-122.4133919,
#                       address="Russian Hill")

#     db.session.add_all([linda, tobias, krysta, patitas])

#     db.session.commit()


##############################################################################
# Helper functions

def init_app():
    # So that we can use Flask-SQLAlchemy, we'll make a Flask app.
    from flask import Flask
    app = Flask(__name__)

    connect_to_db_flask(app)
    print "Connected to DB."


def connect_to_db_flask(app, db_url='postgresql:///lostpets'):
    """Connect the database to our Flask app."""

    # Configure to use our database.
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url
    app.config['SQLALCHEMY_ECHO'] = False
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    db.app = app
    db.init_app(app)
    print db_url


def connect_to_db():
    """This function allows me connect the db with the pipeline of scrappy """

    # Configure to use our database in scrapy
    engine = create_engine('postgres:///lostpets', echo=False, encoding='utf8')
    Session = sessionmaker(bind=engine)
    session = Session()

    return session


if __name__ == "__main__":
    # As a convenience, if we run this module interactively, it will leave
    # you in a state of being able to work with the database directly.

    # So that we can use Flask-SQLAlchemy, we'll make a Flask app.
    from flask import Flask

    app = Flask(__name__)

    connect_to_db_flask(app)
    db.create_all()
    print "Connected to DB."
