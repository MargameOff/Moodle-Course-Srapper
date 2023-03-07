const { prompt } = require('./tools');

async function displaySelectedCourses( coursesList) {
    //foreach course in coursesList
    //display the course name and id
    console.log(`\x1b[0m`+`-----------------`);
    console.log(`\x1b[90m`+`Selected courses: (`+ coursesList.length +` courses)`);
    console.log(`\x1b[0m`);
    coursesList.forEach(course => {
        console.log(`\x1b[0m`+`${course.name}`+ `\x1b[90m`+`  ID: `+`\x1b[0m`+`${course.id}`);
    });
    console.log('-----------------');
    await prompt('Press enter to continue...')
    console.clear();
}

module.exports = { displaySelectedCourses };