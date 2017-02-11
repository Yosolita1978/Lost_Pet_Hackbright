import scrapy
from scrapy.contrib.spiders import Rule, CrawlSpider
from scrapy.contrib.linkextractors.sgml import SgmlLinkExtractor
from items import LostPetItem
# from lostpet.items import LostPetItem




#'https://sfbay.craigslist.org/search/laf?query=dog&lost_and_found_type=1'

def clean_string(list_string):
    concate = ""
    for string in list_string:
        concate += string.rstrip()
        concate = concate.replace("\n", "", 10)
    return concate

#


class PetSpider(CrawlSpider):

    # ITEM_PIPELINES = {'lostpets.pipelines.LostPetPipeline': 100}
    name = "lostpets"
    allowed_domains = ["sfbay.craigslist.org"]
    start_urls = ["https://sfbay.craigslist.org/search/laf?query=dog&lost_and_found_type=1",
                  "https://sfbay.craigslist.org/search/laf?query=cat&lost_and_found_type=1"]

    rules = [
        Rule(SgmlLinkExtractor(allow=[r'.*?/.+?/laf/\d+\.html']), callback='parse_pet', follow=False)]

    def parse_pet(self, response):
        url = response.url
        title = response.xpath('//*[@id="titletextonly"]/text()').extract()[0]
        img = response.xpath('//*[@id="thumbs"]/a/@href').extract()
        description = response.xpath('//*[@id="postingbody"]/text()').extract()
        description = clean_string(description)
        date_list = response.xpath('//*[@id="display-date"]/time').extract()
        date_string = date_list[0]
        date = date_string[32:-27]

        mapdata = response.xpath('//*[@id="map"]')
        longitude = None
        latitude = None
        if len(mapdata) != 0:
            longitude = float(mapdata.xpath("@data-longitude").extract()[0])
            latitude = float(mapdata.xpath("@data-latitude").extract()[0])

        sidebar = response.xpath('/html/body/section/section/section/div[1]/div/div[2]/text()')
        if len(sidebar) != 0:
            neighborhood = response.xpath('/html/body/section/section/section/div[1]/div/div[2]/text()').extract()[0]
            url_google = response.xpath('/html/body/section/section/section/div[1]/div/p/small/a/@href').extract()
        else:
            neighborhood = response.xpath('/html/body/section/section/h2/span[2]/small/text()').extract()
            url_google = None

        item = LostPetItem(title=title,
                           url=url,
                           img=img,
                           description=description,
                           longitude=longitude,
                           latitude=latitude,
                           neighborhood=neighborhood,
                           date=date,
                           url_google=url_google)

        yield item




