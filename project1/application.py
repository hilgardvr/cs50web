import os
import requests
import json

from flask import Flask, session, render_template, request, redirect, abort
from flask_session import Session
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker

app = Flask(__name__)

# Check for environment variable
if not os.getenv("DATABASE_URL"):
    raise RuntimeError("DATABASE_URL is not set")

# Configure session to use filesystem
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

# Set up database
engine = create_engine(os.getenv("DATABASE_URL"))
db = scoped_session(sessionmaker(bind=engine))

@app.route("/")
def index():
    currentUser = None
    if session['logged_in']:
        currentUser = session['logged_in'][0]
    if currentUser == None:
        return render_template('index.html')
    else:
        return render_template('home.html', user=currentUser)

@app.route("/login", methods=['POST'])
def login():
    username = request.form['username']
    password = request.form['password']
    session['logged_in'] = db.execute("SELECT username FROM users WHERE username = :username AND password = :password",
        {"username":username, "password":password}).fetchone()
    session['user_id'] = db.execute("SELECT id FROM users WHERE username = :username AND password = :password",
        {"username":username, "password":password}).fetchone()
    return redirect('/')


@app.route("/register", methods=['POST'])
def register():
    if request.form['username'] != None and request.form['password'] != None:
        username = request.form['username']
        password = request.form['password']
        db.execute("INSERT INTO users (username, password) VALUES (:username, :password)",
            {"username":username, "password":password})
        db.commit();
        print(f"Added user {username} and {password}")
        session['logged_in'] = username
        return redirect('/')
    else:
        print("Empty field in form")
        return redirect('/')

@app.route("/logout", methods=['GET'])
def logout():
    session['logged_in'] = None
    session['user_id'] = None
    return redirect('/')

@app.route("/search_results", methods=['GET'])
def search_results():
    user = session['logged_in'][0]
    isbn = '%' + request.args.get('isbn') + '%'
    bookname = '%' + request.args.get('bookname') + '%'
    author = '%' + request.args.get('author') + '%'
    if isbn == "%%" and bookname == "%%" and author == "%%":
        result = "No search parameters - please enter search params ..."
    else:
        result = db.execute("SELECT * FROM books WHERE isbn LIKE (:isbn) AND title LIKE (:title) AND author LIKE (:author)",
            {"isbn":isbn, "title":bookname, "author":author}).fetchall()
    return render_template('home.html', result=result, user=user)

@app.route("/book_details/<isbn>/<tit>/<author>/<year>", methods=['GET'])
def book_results(isbn, tit, author, year):
    user = session['logged_in'][0]
    book = db.execute("SELECT * FROM books WHERE isbn = :isbn", {"isbn":isbn}).fetchone()
    book_id = book.id
    our_reviews = []
    if book_id:
        our_reviews = db.execute("SELECT * FROM our_reviews WHERE book_id = :book_id", {"book_id":book_id}).fetchall()
        print (our_reviews)
    res = requests.get("http://www.goodreads.com/book/review_counts.json", params={"key": "ob5yNrEgt6v1uC4ZtVumg", "isbns": isbn})
    gr_data = res.json()
    num_ratings = gr_data['books'][0]['ratings_count']
    ave_rating = gr_data['books'][0]['average_rating']
    return render_template('book_details.html', user=user, isbn=isbn, title=tit, author=author, year=year, our_reviews=our_reviews, num_gr=num_ratings, ave_gr=ave_rating)

@app.route("/create_review", methods=["POST"])
def create_review():
    reviewer = request.form['reviewer']
    isbn = request.form['book']
    user_id = session["user_id"][0]
    book = db.execute("SELECT * FROM books WHERE isbn = :isbn", {"isbn": isbn}).fetchone()
    book_id = book.id
    title = book.title
    author = book.author
    year = book.year
    old_reviews = db.execute("SELECT * FROM our_reviews WHERE book_id = :book_id", {"book_id":book_id}).fetchall()
    for rev in old_reviews:
        if rev.reviewer_id == user_id:
            return book_results(isbn, title, author, year)
    rating = request.form['rating']
    review = request.form['review']
    db.execute("INSERT INTO our_reviews (reviewer_id, review, book_id, rating) VALUES (:reviewer, :review, :book_id, :rating)",
        {"reviewer":user_id, "review":review, "book_id":book_id, "rating":rating})
    db.commit()
    return book_results(isbn, title, author, year)

@app.route("/api/<isbn>", methods=["GET"])
def api(isbn):
    book = db.execute("SELECT * FROM books WHERE isbn = :isbn", {"isbn": isbn}).fetchone()
    if not book:
        abort(404)
    book_id = book.id
    title = book.title
    author = book.author
    year = book.year
    reviews = db.execute("SELECT * FROM our_reviews WHERE book_id = :book_id", {"book_id":book_id}).fetchall()
    review_count = len(reviews)
    if review_count == 0:
        temp = {'title':title,'author':author,'year':year,'isbn':isbn,
            'review_count':0}
        return json.dumps(temp)
    review_total = 0
    for rev in reviews:
        review_total += rev.rating
    average_score = review_total / review_count
    temp = {'title':title,'author':author,'year':year,'isbn':isbn,
        'review_count':review_count,'average_score':average_score}
    return json.dumps(temp)
