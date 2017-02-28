from unittest import TestCase
from model import connect_to_db_flask, db, Species, User, Breed, Color, LostPet
from server import app
from flask import session
import json


##############################################################################
# Sample data

def sample_data():
    """ Create sample data for test database. """

    # In case this is run more than once, empty out existing data
    Species.query.delete()

    # Add sample species
    dog_test = Species(name="dog", species_code="d")
    cat_test = Species(name="cat", species_code="c")
    other_test = Species(name="other", species_code="o")

    db.session.add_all([dog_test, cat_test, other_test])
    db.session.commit()

##############################################################################


class FlaskTestsDatabase(TestCase):
    """Flask tests that use the database."""

    def setUp(self):
        """Stuff to do before every test."""

        # Get the Flask test client
        self.client = app.test_client()
        app.config['TESTING'] = True

        # Connect to test database
        connect_to_db_flask(app, db_url="postgresql:///testdb")

        # Create tables and add sample data
        db.create_all()

    def tearDown(self):
        """Do at end of every test."""

        db.session.close()
        db.drop_all()

    def test_it_returns_all_species_with_pets(self):
        """This test is for the Json of the Species that had lostpets associated"""
        # [ { "name": "dog", "species_code": "d" }, { "name": "cat", "species_code": "c" } ]

        dog_test = Species(name="dog", species_code="d")
        cat_test = Species(name="cat", species_code="c")
        patitas = LostPet(species=cat_test,
                          lost_pet_name="Patitas",
                          title="My cat is missing. Help me",
                          lost_pet_gender="M",
                          description="Please help me find my five years old cat",
                          datetime="2017-02-16 14:27:36.182000",
                          latitude=37.7960949,
                          longitude=-122.4133919,
                          address="Russian Hill")
        gota = LostPet(species=dog_test,
                       lost_pet_name="Gota",
                       title="My little chihuahua dog is missing. Help me",
                       lost_pet_gender="F",
                       description="Please help me find my five years old cat",
                       datetime="2017-02-16 14:27:36.182000",
                       latitude=37.7960949,
                       longitude=-122.4133919,
                       address="Russian Hill")

        db.session.add_all([dog_test, cat_test, patitas, gota])
        db.session.commit()

        response = self.client.get("/lostpets/api/species")
        data = json.loads(response.get_data(as_text=True))
        self.assertIn({"name": "dog", "species_code": "d"}, data)
        self.assertIn({"name": "cat", "species_code": "c"}, data)

    def test_it_returns_only_species_with_pets(self):
        """This test is for the Json of the Species that only shows a species with lostpets associated"""
        # [ { "name": "dog", "species_code": "d" }, { "name": "cat", "species_code": "c" } ]

        dog_test = Species(name="dog", species_code="d")
        cat_test = Species(name="cat", species_code="c")
        patitas = LostPet(species=cat_test,
                          lost_pet_name="Patitas",
                          title="My cat is missing. Help me",
                          lost_pet_gender="M",
                          description="Please help me find my five years old cat",
                          datetime="2017-02-16 14:27:36.182000",
                          latitude=37.7960949,
                          longitude=-122.4133919,
                          address="Russian Hill")

        db.session.add_all([dog_test, cat_test, patitas])
        db.session.commit()

        response = self.client.get("/lostpets/api/species")
        data = json.loads(response.get_data(as_text=True))
        self.assertIn({"name": "cat", "species_code": "c"}, data)
        self.assertNotIn({"name": "dog", "species_code": "d"}, data)

if __name__ == "__main__":
    import unittest

    unittest.main()


