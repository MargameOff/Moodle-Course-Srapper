# Moodle Course Scrapper

Moodle Course Scrapper is a tool that allows you to extract data from Moodle platform. This tool is written in JavaScript using Node.js, and it requires some configuration before use. This README provides instructions for installing and configuring the tool.

## Installation

To install the tool, you need to have Node.js installed on your computer. If you don't have it installed, you can download it from the official website: https://nodejs.org/

Once Node.js is installed, follow these steps:

1. Clone the repository: `git clone https://github.com/MargameOff/Moodle-Course-Srapper.git`
2. Navigate to the project folder: `cd Moodle-Course-Srapper`
3. Install dependencies: `npm i`

## Configuration

Before using the tool, you need to configure it by filling out the `config.json` file. The `config.json` file contains two fields:

- `moodleURL`: The URL of your Moodle platform.
- `moodleSession`: The session cookie of your Moodle platform.

To get the session cookie, follow these steps:

1. Open your web browser and log in to your Moodle platform.
2. Open your browser's development tools by pressing F12 or selecting the "Developer Tools" option from the browser menu.
3. In the development tools, select the "Storage" or "Application" tab (this may vary depending on your browser).
4. Under the Storage tab, look for an item named "Cookies" or "Local Storage" (this may vary depending on your browser).
5. Expand this item to display the cookies stored for your Moodle platform.
6. Look for a cookie named "MoodleSession" or similar and select it.
7. In the "Value" column, you should see a string that corresponds to the session cookie for your Moodle platform. Copy this string.
8. Paste the string into the "cookie" field in the config.json file for the project you are using.
9. Save the config.json file and run your project to use the session cookie for your Moodle platform.

Here is an example of what the `config.json` file should look like:
```json
{
    "moodleURL": "https://moodle.class.com",
    "moodleSession": "1a2b3c4v5gfjcl5if5y"
}
```

## Usage

To use the tool, simply run the `main.js` file using Node.js:
`node main.js`

The tool will extract the data from your Moodle platform and save it to folder named `courses`.

## Contributing

If you find a bug or have a suggestion for a new feature, feel free to open an issue or submit a pull request.
