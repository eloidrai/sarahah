const sqlite3 = require("sqlite3");
const bcrypt = require("bcrypt");

/*Base de données*/
const db = new sqlite3.Database("./db/base.db");

module.exports = {
    registerForm: (req, res)=> {
        if (req.session.nom) return res.redirect("/home");
        res.locals = {
            msg: req.session.msg,
            nom: req.session.nom,
            token: req.csrfToken(),
        };
        req.session.msg = 0;
        res.render("register");
    },
    
    register: async (req, res)=> {
        if (!req.body.nom || !req.body.mdp || req.body.nom.length < 4 || req.body.mdp.length < 6) {
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
    },
    
    loginForm: (req, res)=> {
        if (req.session.nom) return res.redirect("/home");
        res.locals = {
            msg: req.session.msg,
            nom: req.session.nom,
            token: req.csrfToken(),
        };
        req.session.msg = 0;
        res.render("login");
    },
    
    login: (req, res)=> {
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
    },
    
    logout: (req, res)=> {
        console.log(req.session.nom + " déconnecté.");
        req.session.nom = undefined;
        res.redirect("/home");  
    }
}
