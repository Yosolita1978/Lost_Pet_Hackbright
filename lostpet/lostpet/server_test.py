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
        sample_data()

    def tearDown(self):
        """Do at end of every test."""

        db.session.close()
        db.drop_all()

    def test_get_species_dog(self):
        """This test is for the Json of the Species"""
        # [ { "name": "dog", "species_code": "d" }, { "name": "cat", "species_code": "c" } ]

        response = self.client.get("/lostpets/api/species")
        data = json.loads(response.get_data(as_text=True))
        print data

        self.assertEqual(data[0], {"name": "dog", "species_code": "d"})

if __name__ == "__main__":
    import unittest

    unittest.main()


