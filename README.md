# LostPet

LostPet is a React app that aggregates all the information about lost dogs and cats in San Francisco and displays the results using the Google Maps API. The data was collected from Craigslist using the Scrapy library and the database was seeded with Scrapy pipelines. Users that have lost a pet can also report them to the site by filling a form and uploading a picture. On the backend, Flask is passing data via POST and GET requests using a restful API. All the endpoints are tested using UnitTests. In the front-end, LostPet is a one-page app built with React, Google Maps, and Bootstrap.

# Features
  - List of the missing pets that have been reported on Craiglist Bay Area
  - Filter the list by search and dates
  - Clean form to report if your pet is missing 
  - Drag and drop image of your lost pet in the report form 
  
### Technologies

Python, Scrappy Framework, SQL, Flask, JavaScript, React, Google Maps API, npm, Browserify, Babelify, Envify

### Structure
This is the structure of my project. 

#### Back-end
    - Model.py. This is the file with all my tables
    - server.py This is my restful API
    - spiders/ - This is the folder with my spider from scrapy
        - items.py This is the class of my items from scrapy
        - test.py This is my main spider
    - pipelines.py This is the scrapy pipelines seeding the DB 
    - seed.py This is the file with the species and breeds

#### Front-end
    - templates/ 
        - home.html This is my index page
    - static/ 
        - style.css This is my css
        - bundle.min.js This is my JS and React code 
    - frontend/
        - components/ Those are my React components for dev  
        - src/ Those are my React files for dev

### Installation

For the back-end dependencies are listed in requirements.txt
For the front-end you must have [npm](https://www.npmjs.com/) installed. From frontend directory run:

```sh
$ npm install 
```
to run all the dependencies in the package.json

## Possible Improvements

This project was completed in under a month, so there are definitely areas for improvement. Specifically:

* Tests on Jest are needed
* Functionality for removing a pet from the list, in two cases: a) the post was removed from Craiglist, b) the owner of the pet found the pet (Yei!!!)
* Functionality for a more directly communication with the owner of the lost pet. Maybe with [Twilio](https://www.twilio.com/), so the owner will receive an SMS if somebody saw the lost pet. 

## Author
Hi! My name is [Cristina Rodriguez ](https://www.linkedin.com/in/crissrodriguez/) and I am a software engineer. I received training from Hackbright Academy, an engineering bootcamp for women in San Francisco  (graduation: March 2017). I used to work as a project manager in a software company and there I got interested in learning Python and being able to create my own software projects. I'm currently seeking a front-end developer role in the San Francisco Bay Area. If you have a role that I should hear about, feel free to email yosola at gmail.

