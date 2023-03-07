const axios = require('axios');
const readline = require("readline");
const { parse } = require('node-html-parser');
var fs = require('fs');
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const prompt = (query) => new Promise((resolve) => rl.question(query, resolve));

module.exports = { axios, prompt, parse, fs };