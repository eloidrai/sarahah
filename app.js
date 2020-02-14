const express = require("express");
const cookieSession = require("cookie-session");
const csurf = require("csurf");
const helmet = require("helmet");
const sqlite3 = require("sqlite3");
const bcrypt = require("bcrypt");

const app = express();
const db = new sqlite3.Database("./db/utilisateurs.db");

app.set("view engine", "ejs");
app.set("views", "./views/");
app.use(express.urlencoded({
    extended: true
}))

app.use(cookieSession({
    name: "session",
    secret: "azertyuiop"
}));

app.use(csurf());

app.use(helmet());

/*Accueil*/
app.get("/home", (req, res)=> {
    res.render("home", {nom: req.session.nom});
    req.session.msg = 0; // Débile
})

/*Inscription*/
app.get("/register", (req, res)=> {
    const message = req.session.msg;
    req.session.msg = 0;
    res.render("register", {msg: message, token: req.csrfToken()});
});

app.post("/register", async (req, res)=> {
    if (!req.body.nom || !req.body.mdp) {
        req.session.msg = 1;                                                // Formulaire incomplet
        return res.redirect("/register");
    }
    const donnees = [req.body.nom, await bcrypt.hash(req.body.mdp, 10)];
    db.run("INSERT INTO Utilisateurs VALUES (?, ?)", donnees, (err)=> {
        if (err) {
            req.session.msg = 2;                                            // Erreur base de données (nom déjà présent)
            return res.redirect("/register");
        }
        req.session.nom = req.body.nom;
        res.redirect("/home");
        console.log(req.session.nom + " inscrit.");
    });
});

/*Connexion*/

app.get("/login", (req, res)=> {
    const message = req.session.msg;
    req.session.msg = 0;
    res.render("login", {msg: message, token: req.csrfToken()});
});

const traitementConnexion = (req, res)=> {
    if (!req.body.nom || !req.body.mdp) {
        req.session.msg = 1;                // Formulaire incomplet
        return res.redirect("/login");
    }
    db.get("SELECT * FROM Utilisateurs WHERE nom=?", [req.body.nom], (err, data)=> {
        if (err) {
            req.session.msg = 2;                // Erreur de la base de données
            return res.redirect("/login");
        } 
        if (!data) {
            req.session.msg = 3;                // N'existe pas
            return res.redirect("/login");
        }
        bcrypt.compare(req.body.mdp, data['mdp'], (err, ok)=> {
            if (ok){     
                req.session.nom = req.body.nom;                 // Connecté
                console.log(req.session.nom + " connecté.");
                return res.redirect("/home");
            }
            req.session.msg = 4;                                // Mot de passe incorrect
            return res.redirect("/login");
        });
    });
};

app.post("/login", traitementConnexion);


/*Erreur CRSF*/
app.use((err, req, res, next)=>{
    res.status(401).end("T'as joué à CRSF, t'as perdu. 😝");
})

/*Déconnexion*/

app.get("/logout", (req, res)=> {
    console.log(req.session.nom + " déconnecté.");
    req.session.nom = undefined;
    res.redirect("/home");
})

/*Page d'erreur*/

app.use((req, res)=> {
    res.end("Erreur 404. Tu t'es perdu");
})

app.listen(8080, ()=> {
    console.log("Le serveur est en écoute sur le port 8080.")
});
