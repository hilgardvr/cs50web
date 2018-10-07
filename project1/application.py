import os

from flask import Flask, session, render_template, request, redirect
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
    currentUser = session.get('logged_in')
    print(currentUser)
    if not currentUser:
        return render_template('index.html')
    else:
        return render_template('home.html', user=currentUser)

@app.route("/login", methods=['POST'])
def logon():
    username = request.form['username']
    password = request.form['password']
    session['logged_in'] = db.execute("SELECT username FROM users WHERE username = :username AND password = :password",
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
    session['logged_in'] = None;
    return redirect('/')

@app.route("/search_results", methods=['GET'])
def search_results():
    if request.args.get('isbn') != "": #or request.args.get['bookname'] != None or request.args['author'] != None:
        result = "todo get db query"
    else:
        result = "No result yet ..."
    return render_template('home.html', result=result)
