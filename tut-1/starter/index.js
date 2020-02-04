const fs = require('fs'); // fs = filesystem
const http = require('http');
const url = require('url');

/////////////////////////////////////////////////////////////////////////////////////////////////////////
// FILES

// blocking synchronous way
// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8'); //no uft-8 willl return a buffer
// console.log(textIn);
// const textOut = `This is what we know about the avocado: ${textIn}.\nCreated on ${Date.now()}`;
// fs.writeFileSync('./txt/output.txt', textOut);
// console.log('file written');

// // non blocking asynchronous way
// fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
//     if (err) return console.log('error :(');

//     fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
//         console.log(data2);
//         fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
//             console.log(data3);

//             fs.writeFile('./txt/final.txt', `${data2}\n${data3}`,'utf-8', err => {
//             console.log('file has been written');
//             })
//         });
//     });
// });

// console.log('will read file');

/////////////////////////////////////////////////////////////////////////////////////////////////////////
//SERVER

const replaceTemplate = (temp, product) => {
    let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
    //product from arg above and .Name taking what is needed from json
    //using /***/g as there are multiple of that name and backtics will jsut get the first placeholder
    output = output.replace(/{%IMAGE%}/g, product.image);
    output = output.replace(/{%QUANTITY%}/g, product.quantity);
    output = output.replace(/{%FROM%}/g, product.from);
    output = output.replace(/{%PRICE%}/g, product.price);
    output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
    output = output.replace(/{%DESCRIPTION%}/g, product.description);
    output = output.replace(/{%ID%}/g, product.id);

    if (!product.organic)
        output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
    return output;
}
const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObject = JSON.parse(data);

const server = http.createServer((req, res) => {
    const pathName = req.url;

    // Overview Page
    if (pathName === '/' || pathName === '/overview') {
        res.writeHead(200, {
            'Content-type': 'text/html'
        });

        const cardsHtml = dataObject.map(element => replaceTemplate(tempCard, element)).join('');
        // element is what holds the data from the json file
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml)
        res.end(output);

        // Product Page
    } else if (pathName === '/product') {
        res.end('this is the PRODUCT');

        // API 
    } else if (pathName === '/api') {
        res.writeHead(200, {
            'Content-type': 'application/json'
        });
        res.end(data); // data here is taken from the data var at the top as it's inthe callback function and has access to the code higher up

        // Not Found
    } else {
        res.writeHead(404, {
            // http header is a piece of into about the response we are sending back and is sent in an object. they should be sent before the response content
            'Content-type': 'text/html',
            'my-own-header': 'hello world'
        });
        res.end('<h1>Page Not Found</h1>')
    }

    // res.end('hello from the server')
    // if this was in it would not display the data in the browser... dunno how or why
});

server.listen(8000, '127.0.0.1', () => {
    console.log('Listening to resquests on port 8000')
})