const { prompt, axios, parse, fs } = require("./tools");
const config = require("../config.json");

function createFolder(path) {
  //create a folder with the name and path given
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
}

async function downloadCourses(coursesList) {
  createFolder(`./courses`);
  for (let i = 0; i < coursesList.length; i++) {
    let course = coursesList[i];
    console.log(`Downloading the course ${course.name}...`);
    await downloadCourse(course);
  }
  console.clear();
  console.log("-----------------");
  console.log(`All courses downloaded`);
  console.log("-----------------");
  await prompt("Press enter to continue...");
  console.clear();
}

async function downloadCourse(course) {
  createFolder(`./courses/${course.name}`);
  let response = await axios.get(
    `${config.moodleURL}/course/view.php?id=${course.id}`,
    {
      headers: {
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
        "User-Agent":
          "Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/110.0",
        Cookie: `MoodleSession=${config.moodleSession}`,
      },
    }
  );
  let root = parse(response.data);
  let homeCat = root.getElementById("section-0");
  createFolder(`./courses/${course.name}/Home`);
  await getTextBySection(homeCat, course, "Home");
  await getFilesBySection(homeCat, course, "Home");
  let categories = root
    .querySelector(".nav.nav-tabs")
    .querySelectorAll(".nav-item");
  for (let i = 0; i < categories.length; i++) {
    let category = categories[i];
    let catName = category.querySelector("a").text.replace(/\//g, "-");
    let sectionNumber = category
      .querySelector("a")
      .getAttribute("href")
      .split("=")
      .pop()
      .substring(1);
    createFolder(`./courses/${course.name}/${catName}`);
    let resources = root.getElementById(sectionNumber);
    await getTextBySection(resources, course, catName);
    await getFilesBySection(resources, course, catName);
  }
}

async function getFilesBySection(section, course, catName) {
  if (section != undefined) {
    let content = section.querySelector(".content");
    if (content != undefined) {
      // download all files in the section
      let files = content.querySelectorAll(".modtype_resource");
      if (files != null) {
        for (let j = 0; j < files.length; j++) {
          let element = files[j];
          let link = element.querySelector("a").getAttribute("href");
          let response = await axios.get(link + `&redirect=1`, {
            headers: {
              Accept:
                "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
              "Accept-Encoding": "gzip, deflate, br",
              "Accept-Language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
              "User-Agent":
                "Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/110.0",
              Cookie: `MoodleSession=${config.moodleSession}`,
            },
          });
          let file = response.data;
          let fileName = response.request.res.responseUrl.split("/").pop();
          fs.writeFileSync(
            `./courses/${course.name}/${catName}/${fileName}`,
            file
          );
        }
      }

      // download all images in the section
      let images = content.querySelectorAll(".img-fluid");
      if (images != null) {
        for (let j = 0; j < images.length; j++) {
          let element = images[j];
          let link = element.getAttribute("src");
          //axios download the image and save it in the folder
          await axios({
            method: "get",
            url: link,
            responseType: "stream",
          }).then(function (response) {
            response.data.pipe(
              fs.createWriteStream(
                `./courses/${course.name}/${catName}/${link.split("/").pop()}`
              )
            );
          });
        }
      }

      //downloqd all file in folder
      let folders = content.querySelectorAll(".modtype_folder");
      if (folders != null) {
        for (let j = 0; j < folders.length; j++) {
          let element = folders[j];
          let link = element.querySelector("a").getAttribute("href");
          let response2 = await axios.get(link, {
            headers: {
              Accept:
                "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
              "Accept-Encoding": "gzip, deflate, br",
              "Accept-Language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
              "User-Agent":
                "Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/110.0",
              Cookie: `MoodleSession=${config.moodleSession}`,
            },
          });
          let root2 = parse(response2.data);
          let files2 = root2.querySelectorAll(".fp-filename-icon");
          if (files2 != null) {
            for (let k = 1; k < files2.length; k++) {
              let file2 = files2[k];
              let prelink2 = file2.querySelector("a");
              if (prelink2 != null) {
                let link2 = prelink2.getAttribute("href");
                let response2 = await axios.get(link2, {
                  headers: {
                    Accept:
                      "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
                    "Accept-Encoding": "gzip, deflate, br",
                    "Accept-Language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
                    "User-Agent":
                      "Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/110.0",
                    Cookie: `MoodleSession=${config.moodleSession}`,
                  },
                });

                let file3 = response2.data;
                let fileName3 = response2.request.res.responseUrl
                  .split("/")
                  .pop()
                  .split("?")
                  .shift();
                fs.writeFileSync(
                  `./courses/${course.name}/${catName}/${fileName3}`,
                  file3
                );
              }
            }
          }
        }
      }

      //download all assingments in the section
      let assignments = content.querySelectorAll(".modtype_assign");
      if (assignments != null) {
        for (let j = 0; j < assignments.length; j++) {
          let element = assignments[j];
          let prelink = element.querySelector("a");
          if (prelink != null) {
            let link = prelink.getAttribute("href");
            let response = await axios.get(link, {
              headers: {
                Accept:
                  "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
                "Accept-Encoding": "gzip, deflate, br",
                "Accept-Language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
                "User-Agent":
                  "Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/110.0",
                Cookie: `MoodleSession=${config.moodleSession}`,
              },
            });
            let root2 = parse(response.data);
            let files2 = root2.querySelectorAll(".fileuploadsubmission");
            if (files2 != null) {
              let assignmentName = root2
                .querySelector("#region-main")
                .querySelector("h2").text;
              createFolder(
                `./courses/${course.name}/${catName}/${assignmentName}`
              );
              for (let k = 0; k < files2.length; k++) {
                let file3 = files2[k];
                let link = file3.querySelector("a").getAttribute("href");
                let response = await axios.get(link, {
                  headers: {
                    Accept:
                      "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
                    "Accept-Encoding": "gzip, deflate, br",
                    "Accept-Language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
                    "User-Agent":
                      "Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/110.0",
                    Cookie: `MoodleSession=${config.moodleSession}`,
                  },
                });
                let file2 = response.data;
                let fileName = response.request.res.responseUrl
                  .split("/")
                  .pop()
                  .split("?")
                  .shift();
                fs.writeFileSync(
                  `./courses/${course.name}/${catName}/${assignmentName}/${fileName}`,
                  file2
                );
              }
            }
          }
        }
      }
    }
  }
}

async function getTextBySection(section, course, catName) {
  let finalText = "";
  if (section != undefined) {
    let content = section.querySelector(".content");
    if (content != undefined) {
      let text = content.querySelectorAll("p");
      if (text != undefined) {
        for (let j = 0; j < text.length; j++) {
          let element = text[j];
          finalText += element.text + "\n";
        }
      }
      //get all urls in the section
      let urls = content.querySelectorAll(".modtype_url");
      if (urls != null) {
        for (let j = 0; j < urls.length; j++) {
          let element = urls[j];
          let shortUrl = element.querySelector("a").getAttribute("href");
          let url = await unshortenUrl(shortUrl + `&redirect=1`);
          finalText += url + "\n";
        }
      }
    }
  }
  fs.writeFileSync(`./courses/${course.name}/${catName}/Text.txt`, finalText);
}

async function unshortenUrl(url) {
  //fait une requete sur l'url et retourne la vrai url tout en gerant les exeptions possibles
  try {
    let response = await axios.get(url, {
      headers: {
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
        "User-Agent":
          "Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/110.0",
        Cookie: `MoodleSession=${config.moodleSession}`,
      },
    });
    return response.request.res.responseUrl;
  } catch (error) {
    return "URL from google are not supported";
  }
}
module.exports = { downloadCourses };
