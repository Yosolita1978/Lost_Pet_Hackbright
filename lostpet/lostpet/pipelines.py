# -*- coding: utf-8 -*-

# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: http://doc.scrapy.org/en/latest/topics/item-pipeline.html
import json

class LostPetPipeline(object):

    def __init__(self):
        self.file = open('datapets.jl', 'wb')

    def process_item(self, item, spider):
        print "This is your data"

        for k,v in dict(item).items():
            print type(k), type(v)
            print k, v
        print type(dict(item)["neighborhood"][0]), dict(item)["neighborhood"][0]

        line = json.dumps(dict(item), indent=4, sort_keys=True, default=str) + "\n"
        self.file.write(line)
        
        return item