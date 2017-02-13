# -*- coding: utf-8 -*-

# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: http://doc.scrapy.org/en/latest/topics/item-pipeline.html

from model import Species, User, Breed, Color, LostPet, BreedPet, ColorPet, connect_to_db

    # Configure to use our database.
    # app.config['SQLALCHEMY_DATABASE_URI'] = 'postgres:///lostpets'
    # app.config['SQLALCHEMY_ECHO'] = False
    # app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    # db.app = app
    # db.init_app(app)


class LostPetPipeline(object):

    def __init__(self):
        """
        Initializes database connection.
        """
        self.session = connect_to_db()

    def process_item(self, item, spider):

        urls = self.session.query(LostPet.url).all()

        if item["url"] not in urls:
            url = item["url"]
            description = item["description"].decode("utf-8")
            datetime = item["date"]
            latitude = item["latitude"]
            longitude = item["longitude"]
            title = item["title"].decode("utf-8")
            img = item["img"]
            neighborhood = item["neighborhood"]
            photo = None

            if type(img) == list and len(img) != 0:
                    photo = img[0]

            if type(neighborhood) == list and len(neighborhood) != 0:
                neighborhood = neighborhood[0]

            if "dog" in item["description"] or "dog" in item["title"]:
                species_code = self.session.query(Species.species_code).filter(Species.name == 'dog').one()
            elif "cat" in item["description"] or "cat" in item["title"]:
                species_code = self.session.query(Species.species_code).filter(Species.name == 'cat').one()
            else:
                return

            pet = LostPet(species_code=species_code, title=title, description=description, datetime=datetime, photo=photo, latitude=latitude, longitude=longitude, neighborhood=neighborhood, url=url)

        else:
            print "Sorry, That pet already exists"

        try:
            self.session.add(pet)
            self.session.commit()
        except:
            self.session.rollback()
            raise
        finally:
            self.session.close()
