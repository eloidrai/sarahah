const sqlite3 = require("sqlite3");

/*Base de données*/
const db = new sqlite3.Database("./db/base.db");

module.exports = {
    msgForm: (req, res)=> {
        db.get(`SELECT * FROM Utilisateurs WHERE nom=?`, [req.params.personne], (err, data)=> {
            if (data) {
                res.locals = {personne: req.params.personne,nom: req.session.nom, token: req.csrfToken(), ok: req.session.msgOk};
                req.session.msgOk = 0;
                res.render("page")
            } else {
                res.redirect("/");
            }
        })
    },
    
    submit: (req, res)=> {
        db.run(`INSERT INTO Messages VALUES (?, ?)`, [req.body.msg, req.params.personne], (err)=>{});
        req.session.msgOk = !!req.body.msg.length;
        res.redirect(req.path)
    },
    
    list: (req, res)=> {
        db.all(`SELECT contenu FROM Messages WHERE nom_u=?`, [req.session.nom], (err, data)=> {
            if (err) return res.redirect("/");;
            res.locals = {
                nom: req.session.nom,
                messages: data
            };
            res.render("list");
        })
    }
}
