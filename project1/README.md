# Project 1

Web Programming with Python and JavaScript

application.py: flask app with the following routes:
    / -> index page
    login -> POST request loggin user in
    register -> POST request adding a new user to db
    logout -> log user out
    search_results -> retrieving book search results from db
    book_details -> outputting book details from db and goodreads + add review form
    create_review -> POST request adding review to db
    api -> api call route return json with book info

import.py: importing book data from csv into sql db

templates/layout.html: setting basic layout features form inheritance

templates/index.html: index page

templates/home.html: logged in user home page

templates/book_details.html: display book details + review form
