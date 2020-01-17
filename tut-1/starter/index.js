const fs = require('fs'); // fs = filesystem

const textIn = fs.readFileSync('./txt/input.txt', 'utf-8'); //no uft-8 willl return a buffer
console.log(textIn);

const textOut = `This is what we know about the avocado: ${textIn}.\nCreated on ${Date.now()}`;

fs.writeFileSync('./txt/output.txt', textOut);
console.log('file written')