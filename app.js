const express = require("express");
const cookieSession = require("cookie-session");
const csurf = require("csurf");
const helmet = require("helmet");

const app = express();

const auth = require("./ctrl/auth");
const msg = require("./ctrl/msg");


/*Middlewares*/

app.set("view engine", "ejs");
app.set("views", "./views/");
app.use(express.urlencoded({
    extended: true
}))

app.use(cookieSession({
    name: "session",
    secret: process.env.SESS_SECRET || 'azerty'
}));

app.use(csurf());

app.use(helmet());

/*Accueil*/
app.get("/", (req, res)=> {
    res.render("home", {nom: req.session.nom, lien: `https://${req.headers['host']}/page/${req.session.nom}`});
})

/*Inscription - Connexion -  Deconnexion*/
app.get("/register", auth.registerForm);
app.post("/register", auth.register);
app.get("/login", auth.loginForm);
app.post("/login", auth.login);
app.get("/logout", auth.logout)

/*Pages utilisateurs*/
app.get("/page/:personne", msg.msgForm)
app.post("/page/:personne", msg.submit)

/*Liste*/
app.get("/list", msg.list)

/*Erreur serveur*/
app.use((err, req, res, next)=>{
    res.status(401).end("Erreur serveur, peut-être avez-vous essayé de nous pirater. :(");
})

app.use("/public/", express.static("public/"))

/*Page d'erreur*/
app.use((req, res)=> {
    res.redirect("/");
})


app.listen(process.env.PORT || 8081, ()=> {
    console.log("Le serveur est en écoute.");
    console.log("Aller à http://localhost:8081/home");
});
