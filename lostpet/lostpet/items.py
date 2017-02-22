# -*- coding: utf-8 -*-

# Define here the models for your scraped items
#
# See documentation in:
# http://doc.scrapy.org/en/latest/topics/items.html

from scrapy.item import Item, Field


class LostPetItem(Item):
    # define the fields for your item here like:
    title = Field()
    img = Field()
    description = Field()
    longitude = Field()
    latitude = Field()
    author = Field()
    date = Field()
    contact_info = Field()
    address = Field()
    url_google = Field()
    url = Field()
