//fait une simple interface console avec un menu pour lancer les fonctions avec une fonction qui affiche en ascii art le nom Moodle Scrapper
//Importation des modules
const { prompt } = require('./functions/tools');

//Déclaration des variables
let connection
let username
let coursesList = []

//Importation de testConnection
const testConnection = require('./functions/testConnection').testConnection;
const chooseCourses = require('./functions/chooseCourses').chooseCourses;
const displayCourses = require('./functions/displaySelectedCourses').displaySelectedCourses;
const downloadCourses = require('./functions/downloadCourses').downloadCourses;
//set non obligatoire parametre de home
async function home() {
    console.log(`-----------------`);
    console.log(`Moodle Scrapper`);
    console.log(`version 1.0.0`);
    console.log(`-----------------`);
    if (connection) {
        //couleur du texte en vert pour le nom de l'utilisateur sans sauter de ligne
        console.log(`\x1b[32m`, `Connected as `+ username);
        //couleur du texte en normal pour tout le reste du texte
        console.log(`\x1b[0m`+`-----------------`);
        //affiche le texte en gris pour le choix 1 uniquement et pas le reste

        console.log(`\x1b[90m`+`1. Testing the connection`);
        console.log(`\x1b[0m`+`2. Choose which courses to download`);
    } else {
        console.log(`\x1b[31m`+`Not connected, please try to connect`);
        console.log(`\x1b[0m`+ `-----------------`);
        console.log(`1. Testing the connection`);
        console.log(`\x1b[90m`+`2. Choose which courses to download`);
    }
    if (coursesList.length > 0) {
        console.log(`\x1b[0m`+`3. Display selected courses`);
    } else {
        console.log(`\x1b[90m`+`3. Display selected courses`);
    }
    console.log(`4. Download the courses`);
    console.log(`\x1b[0m`);
    console.log(`8. About`);
    console.log(`9. Exit`);
    console.log(`-----------------`);
    let choice = await prompt(`What do you want to do ? > `);
    switch (choice) {
        case '1':
            console.clear();
            if (connection) { break }
            let tmp = await testConnection();
            if (!tmp) {connection = false;}
            else {connection = true; username = tmp}
            break;
        case '2':
            console.clear();
            if (!connection) { break }
            let temp = await chooseCourses();
            if (!temp) {break;} else {coursesList = temp;}
            break;
        case '3':
            console.clear();
            if (!connection && coursesList.length == 0) { break }
            await displayCourses(coursesList);
            break;
        case '4':
            console.clear();
            if (!connection) { break }
            await downloadCourses(coursesList);
            break;
        case '8':
            about();
            break;
        case '9':
            console.log(`Exiting...`);
            process.exit();
            break;
        default:
            console.log(`Invalid choice`);
            break;
    }
}

async function main () {
    console.clear();
    while (true) {
        await home();
    }    
}

main();

