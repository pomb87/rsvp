const express = require("express");
const app = express();
const sqlite3 = require("sqlite3").verbose();

var bodyparser = require('body-parser');
app.use(bodyparser.json());

app.set("view engine", "ejs");

const path = require("path");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false })); // <--- middleware configuration
app.use('/favicon.ico', express.static('images/favicon.ico'));

const db_name = path.join(__dirname, "data", "invites.db");
const db = new sqlite3.Database(db_name, err => {
    if (err) {
        return console.error(err.message);
    }
    console.log("Successful connection to the database 'apptest.db'");
});

const sql_create = `CREATE TABLE IF NOT EXISTS Invites (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    NAME VARCHAR(100) NOT NULL,
    ADDRESS VARCHAR(100),
    PERSON_COUNT VARCHAR(5),
    CHILD_COUNT VARCHAR(5),
    RSVP VARCHAR(10) NOT NULL
  );`;

db.run(sql_create, err => {
    if (err) {
        return console.error(err.message);
    }
    console.log("Successful creation of the 'Invites' table " + sql_create);
});

app.listen(3000, () => {
    console.log("Server started (http://localhost:3000/) !");
});

/*****************GET requests **************/
app.get("/", (req, res) => {
    console.log("get invite through /");
    res.render("invite");
});

app.get("/invite", (req, res) => {
    console.log("get invite");
    res.render("invite");
});

app.get("/start", (req, res) => {
    console.log("get start");
    res.render("start", {
        model: {}
    });
});

app.get("/intro", (req, res) => {
    console.log("get intro");
    res.render("intro", {
        model: {}
    });
});

/*************** Admin page to show the stored data ***********/
app.get("/admin", (req, res) => {
    console.log("get admin");
    const sql = "SELECT * FROM INVITES ORDER BY NAME";
    db.all(sql, [], (err, rows) => {
        if (err) {
            return console.error(err.message);
            res.render("error", {
                model:
                    {}
            });
        }
        res.render("admin", { model: rows });
    });
});

/**************** Error Page **************/
app.get("/error", (req, res) => {
    console.log("get error page");
    res.render("error");
});

/*****************POST requests **************/
app.post("/layout", (req, res) => {
    console.log("post layout");
    res.render("layout.ejs", {
        model: {}
    });
});

app.post("/rsvpName", (req, res) => {
    console.log("post rsvpName");
    res.render("rsvp_name.ejs", {
        model: {}
    });
});

app.post("/rsvpConfirm", (req, res) => {
    forwardTo("rsvpConfirm", "rsvp_confirmation", req, res);
});

app.post("/rsvpPerson", (req, res) => {
    forwardTo("rsvpPerson", "rsvp_person", req, res);
});

app.post("/rsvpAddress", (req, res) => {
    forwardTo("rsvpAddress", "rsvp_address", req, res);
});

app.post("/rsvpDecline", (req, res) => {
    forwardTo("rsvpDecline", "decline", req, res);
});

app.post("/rsvpEnd", (req, res) => {
    forwardTo("rsvpEnd", "confirmation", req, res);
});

function forwardTo(urlFrom, renderUrl, req, res) {
    console.log("forward to post " + urlFrom);
    /** name is filled on first step */
    console.log("name = " + req.body.name);
    /** Confirmation is filled on second step */
    console.log("Confirmation = " + req.body.confirmation);
    /** personCount is filled on third step  */
    console.log("personCount = " + req.body.personCount);
    /** childCount is filled on third step  */
    console.log("childCount = " + req.body.childCount);
    /** address1 is optional filled on fourth step  */
    console.log("address1 = " + req.body.address1);
    /** address2 is optional filled on fourth step  */
    console.log("address2 = " + req.body.address2);
    if ("decline" === renderUrl) {
        insertAndForwardDecline(renderUrl, req, res);
    } else if ("confirmation" === renderUrl) {
        insertAndForwardToConfirm(renderUrl, req, res);
    } else {
        res.render(renderUrl, {
            model:
            {
                name: req.body.name,
                confirmation: req.body.confirmation,
                personCount: req.body.personCount,
                childCount: req.body.childCount
            }
        });
    }
}

function insertAndForwardDecline(renderUrl, req, res) {
    const sql = "INSERT INTO Invites (NAME, RSVP) VALUES (?,?)";
    const insert = [req.body.name, "no"];
    db.run(sql, insert, err => {
        if (err) {
            console.log("ERROR - " + err);
            res.render("error", {
                model:
                    {}
            });
        } else {
            console.log("INSERT of - name = " + req.body.name + " confirmation = no");
            res.render(renderUrl, {
                model:
                    {}
            });
        }
    });
}

function insertAndForwardToConfirm(renderUrl, req, res) {
    var address = "" + req.body.address1 + " - " + req.body.address2;
    const sql = "INSERT INTO Invites (NAME, RSVP, PERSON_COUNT, CHILD_COUNT, ADDRESS) VALUES (?,?,?,?,?)";
    const insert = [req.body.name, req.body.confirmation, req.body.personCount, req.body.childCount, address];
    db.run(sql, insert, err => {
        if (err) {
            console.log("ERROR - " + err);
            res.render("error", {
                model:
                    {}
            });
        } else {
            console.log("INSERT of - name = " + req.body.name + " confirmation = " + req.body.confirmatio + " personCount = " + req.body.personCount
             + " personCount = " +req.body.childCount + " address = " + address);
            res.render(renderUrl, {
                model:
                    {}
            });
        }
    });
}