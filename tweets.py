import requests
from bs4 import BeautifulSoup
from urlparse import urljoin

URL = 'https://sfbay.craigslist.org/search/laf?query=dog&lost_and_found_type=1'
BASE = 'http://sfbay.craigslist.org/search/laf'

response = requests.get(URL)

soup = BeautifulSoup(response.content, "html.parser")
for listing in soup.find_all('ul',{'class':'rows'}):
    if listing.find('a',{'class':'result-title-hdrlnk'}) != None:
        name = listing.text
        print name
        print "\n"


            # link_end = listing.a['href']
            # url = urljoin(BASE, link_end)
            # print url
            # print "\n"