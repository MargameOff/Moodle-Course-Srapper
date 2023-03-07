//Fait une requête à l'API de moodle pour tester la connexion
//Importation des modules
const { axios } = require('./tools');

//Déclaration des variables
let config = require('../config.json');

async function testConnection() {
    console.log(`Testing the connection...`);
    let response = await axios.get(`${config.moodleURL}/user/profile.php`, {
        headers: {
            Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7',
            'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/110.0',
            Cookie: `MoodleSession=${config.moodleSession}`
        }
    });
    let data = await response.data;
    //get le nom de l'utilisateur
    //si il y a une erreur, affiche l'erreur
    //sinon, affiche le nom de l'utilisateur et affiche que la connexion est réussie
    let title = data.match(/<title>(.*)<\/title>/)[1];
    if (title == 'Connexion') {
        console.log(`Error: Token invalid or expired`);
        return false;
    } else {
        console.log(`Connection successful, welcome `+title.match(/(.*):/)[1]);
        return title.match(/(.*):/)[1];
    }
}
module.exports = { testConnection };