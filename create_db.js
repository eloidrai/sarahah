const sqlite3 = require("sqlite3");

/*Base de données*/
const db = new sqlite3.Database("./db/base.db");
db.run(
    `CREATE TABLE IF NOT EXISTS Utilisateurs (
    nom TEXT PRIMARY KEY,
    mdp TEXT);`
);

db.run(
    `CREATE TABLE IF NOT EXISTS Messages (
    contenu TEXT,
    nom_u TEXT,
    FOREIGN KEY (nom_u)
        REFERENCES Utilisateurs(nom)
    );`
);
