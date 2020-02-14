import requests

def nu(nom):
    return requests.post("http://localhost:8080/register", data={'nom': nom, 'mdp': "azerty"}).text
    
def co(nom):
    return requests.post("http://localhost:8080/login", data={'nom': nom, 'mdp': "azerty"}).text
    
def lo():
    requests.get("http://localhost:8080/logout")