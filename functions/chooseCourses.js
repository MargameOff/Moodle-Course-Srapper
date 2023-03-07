//fonction qui permet de choisir les cours à télécharger

//Importation des modules
const { prompt, axios } = require('./tools');
//Déclaration des variables
let config = require('../config.json');

async function chooseCourses() {
    console.log(`Getting the courses...`);
    let response = await axios.get(`${config.moodleURL}/my/`, {
        headers: {
            Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7',
            'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/110.0',
            Cookie: `MoodleSession=${config.moodleSession}`
        }
    });
    let data = await response.data;
    let courses = data.match(/<div class="course_title">([\s\S]*?)<\/div>/g);
    let coursesList = [];
    console.log(`Courses found: `+courses.length);
    console.log(`-----------------`);
    for (let i = 0; i < courses.length; i++) {
        //creation dun objet course avec le nom, l'url et l'id
        let course = {
            name: courses[i].match(/<a title="([\s\S]*?)" href="([\s\S]*?)">([\s\S]*?)<\/a>/)[1],
            url: courses[i].match(/<a title="([\s\S]*?)" href="([\s\S]*?)">([\s\S]*?)<\/a>/)[2],
            id: courses[i].match(/<a title="([\s\S]*?)" href="([\s\S]*?)">([\s\S]*?)<\/a>/)[2].match(/id=(\d+)/)[1]
        }
        coursesList.push(course);
        console.log(`${i+1}. ${course.name} (${course.id})`);
    }
    console.log(`-----------------`);
    let coursesToDownload = await prompt(`Enter the number of the courses you want to download (separated by space) or 'all' to download all the courses > `);
    if (coursesToDownload == 'all') {
        console.clear();
        console.log(`Selecting all the courses...`);
        return coursesList;
    } else if (coursesToDownload == '' || coursesToDownload == ' ' || coursesToDownload == '  ') {
        console.log(`Error: No course selected`);
        return false;
    }
    else {
        let coursesToDownloadArray = coursesToDownload.split(' ');
        let coursesToDownloadArray2 = [];
        for (let i = 0; i < coursesToDownloadArray.length; i++) {
            if (coursesToDownloadArray[i] > coursesList.length) {
                console.log(`Error: The course number ${coursesToDownloadArray[i]} doesn't exist`);
                return false;
            } else {
                coursesToDownloadArray2.push(coursesList[coursesToDownloadArray[i]-1]);
            }
            
        }
        console.clear();
        console.log(`Successfully selected the courses`);
        return coursesToDownloadArray2;
    }

}
module.exports = { chooseCourses };
