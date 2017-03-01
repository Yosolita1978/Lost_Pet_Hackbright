from unittest import TestCase
from model import connect_to_db_flask, db, Species, User, Breed, Color, LostPet
from server import app, create_pet
from flask import session
import json

##############################################################################
#For this cases each escenario will create the sample data that needs for the code that we're testing.

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

    def test_it_returns_a_list_of_pets(self):
        """This test returns the list of all the pets in the db."""

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
        tobias = LostPet(species=dog_test,
                         lost_pet_name="Tobias",
                         title="I lost my boxer. Two years old",
                         lost_pet_gender="M",
                         description="Please help me find my dog. He is my best friend",
                         datetime="2017-02-01 17:51:43.235000",
                         latitude=37.78526,
                         longitude=-122.411953,
                         address="Tenderloin")

        db.session.add_all([dog_test, cat_test, patitas, tobias])
        db.session.commit()

        response = self.client.get("/lostpets/api/lostpets.json")
        data = json.loads(response.get_data(as_text=True))
        self.assertIs(type(data["result"]), list)
        self.assertNotEqual(len(data["result"]), 0)

    def test_it_returns_the_search_for_a_pet_for_id(self):
        """This test returns a list with the lost pet that you ask for in the id"""

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

        params = {"lost_pet_id": 1}
        response = self.client.get("/lostpets/api/lostpets.json", query_string=params)
        data = json.loads(response.get_data(as_text=True))
        self.assertIs(type(data["result"]), list)
        self.assertEqual(len(data["result"]), 1)
        self.assertIn("lostpet_name", data["result"][0])

    def test_it_returns_the_search_for_a_species(self):
        """This test returns the list of all the pets in the db with the species that you send as params."""

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
        tobias = LostPet(species=dog_test,
                         lost_pet_name="Tobias",
                         title="I lost my boxer. Two years old",
                         lost_pet_gender="M",
                         description="Please help me find my dog. He is my best friend",
                         datetime="2017-02-01 17:51:43.235000",
                         latitude=37.78526,
                         longitude=-122.411953,
                         address="Tenderloin")

        db.session.add_all([dog_test, cat_test, patitas, tobias])
        db.session.commit()

        params = {"species_code": "c"}
        response = self.client.get("/lostpets/api/lostpets.json", query_string=params)
        data = json.loads(response.get_data(as_text=True))
        self.assertIs(type(data["result"]), list)
        self.assertNotEqual(len(data["result"]), 0)
        # print data["result"]
        self.assertIn("species_code", data["result"][0])
        self.assertNotIn("d", data["result"][0])

    def test_it_returns_the_search_for_a_text_in_the_description(self):
        """This test returns the list of all the pets in the db with the match text that you send as params."""

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
        tobias = LostPet(species=dog_test,
                         lost_pet_name="Tobias",
                         title="I lost my boxer. Two years old",
                         lost_pet_gender="M",
                         description="Please help me find my dog. He is my best friend",
                         datetime="2017-02-01 17:51:43.235000",
                         latitude=37.78526,
                         longitude=-122.411953,
                         address="Tenderloin")
        krysta = LostPet(species=cat_test,
                         lost_pet_name="Krysta",
                         title="My cat run away from home",
                         lost_pet_gender="F",
                         description="Please help me find my calico maine cat",
                         datetime="2017-02-10 11:08:51.067000",
                         latitude=37.7958617,
                         longitude=-122.3945241,
                         address="Pacific Heights")

        db.session.add_all([dog_test, cat_test, patitas, tobias, krysta])
        db.session.commit()

        text = "cat"
        params = {"text_search": text}
        response = self.client.get("/lostpets/api/lostpets.json", query_string=params)
        data = json.loads(response.get_data(as_text=True))
        self.assertIs(type(data["result"]), list)
        self.assertNotEqual(len(data["result"]), 0)
        # print data["result"]
        self.assertIn(text, data["result"][0]["description"])

    def test_it_returns_the_search_for_a_date_sorted_for_most_recents(self):
        """This test returns the list of all the pets in the db with the date sended as params sorted for the most recents."""

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
        tobias = LostPet(species=dog_test,
                         lost_pet_name="Tobias",
                         title="I lost my boxer. Two years old",
                         lost_pet_gender="M",
                         description="Please help me find my dog. He is my best friend",
                         datetime="2017-02-01 17:51:43.235000",
                         latitude=37.78526,
                         longitude=-122.411953,
                         address="Tenderloin")
        krysta = LostPet(species=cat_test,
                         lost_pet_name="Krysta",
                         title="My cat run away from home",
                         lost_pet_gender="F",
                         description="Please help me find my calico maine cat",
                         datetime="2017-02-10 11:08:51.067000",
                         latitude=37.7958617,
                         longitude=-122.3945241,
                         address="Pacific Heights")

        db.session.add_all([dog_test, cat_test, patitas, tobias, krysta])
        db.session.commit()

        date = "2017-02-10"
        params = {"since": date}
        response = self.client.get("/lostpets/api/lostpets.json", query_string=params)
        data = json.loads(response.get_data(as_text=True))
        self.assertIs(type(data["result"]), list)
        self.assertNotEqual(len(data["result"]), 0)
        # print data["result"]
        self.assertIn(date, data["result"][-1]["datetime"])
        self.assertNotIn(date, data["result"][0]["datetime"])

    def test_it_returns_the_most_simple_lost_pet(self):
        """This test returns the newpet object with the most simple params that you need, but all the data is there with null"""

        dog_test = Species(name="dog", species_code="d")
        cat_test = Species(name="cat", species_code="c")

        db.session.add_all([dog_test, cat_test])
        db.session.commit()

        species_code = "c"
        name = "Krysta"
        title = "My cat run away from home"
        lost_pet_gender = "F"
        address = "Pacific Heights"
        description = "Please help me find my calico maine cat"

        response = self.client.post("/lostpets/api/lostpets", data=dict(
            species_code=species_code,
            lost_pet_name=name,
            title=title,
            lost_pet_gender=lost_pet_gender,
            address=address,
            description=description))

        result = json.loads(response.get_data(as_text=True))
        # import pdb; pdb.set_trace()
        print result
        self.assertIs(type(result), dict)
        self.assertIn("lostpet_name", result)
        self.assertIn("lostpet_id", result)



if __name__ == "__main__":
    import unittest

    unittest.main()
