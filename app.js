const express = require("express");
const cookieSession = require("cookie-session");
const csurf = require("csurf");
const helmet = require("helmet");

const app = express();

const auth = require("./ctrl/auth");
const msg = require("./ctrl/msg");


/*Middlewares*/

//app.use(require("morgan")())

app.set("view engine", "ejs");
app.set("views", "./views/");
app.use(express.urlencoded({
    extended: true
}))

app.use(cookieSession({
    name: "session",
    secret: "zq1256532we562sx65d526r3gfvh6bg5f56v6c6trdxeryb"
}));

app.use(csurf());

app.use(helmet());

/*Accueil*/
app.get("/home", (req, res)=> {
    res.render("home", {nom: req.session.nom});
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
/*app.use((err, req, res, next)=>{
    res.status(401).end("Erreur serveur, peut-être avez-vous essayé de nous pirater. :(");
})*/


app.use("/public/", express.static("public/"))

/*Page d'erreur*/
app.use((req, res)=> {
    res.redirect("/home");
    //res.end("Erreur 404. Tu t'es perdu");
})


app.listen(8081, ()=> {
    console.log("Le serveur est en écoute.");
    console.log("Aller à http://localhost:8081/home");
});
