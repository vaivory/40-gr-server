import http from 'http';
import { utils } from './utils.js';

const server = {};

server.httpServer = http.createServer((req, res) => {
    const baseURL = `http${req.socket.encryption ? 's' : ''}://${req.headers.host}/`;  //bandom surasti musu domena kur mes dirbas, t.y. per aplinkui, jei uzklausa atejo pas mane tai as zinau kur as esu
    const parsedURL = new URL(req.url, baseURL);  //padarom objekta ,t.y. visa informacija isskaidom, kad mum viska graziai rodytu
    const httpMethod = req.method; //dar sito nepanaudojom
    const parsedPathName = parsedURL.pathname;  //dalis i kuri url kreipiasi
    const trimmedPath = parsedPathName.replace(/^\/+|\/+$/g, '');   // regex, ir istrimintas, cia replacinom, t.y. pasalinom tik priekyeja ir tik galia galima iesanciu slashus

    /*
    Tekstiniai failai:
        - css
        - js
        - svg
    Binary failai:
        - jpg, png, gif, ico (nuotraukos)
        - woff, eot, ttf (sriftai)
        - audio, video
    API (formos, upload file, t.t.)
    HTML turinys (puslapis)
    */


    const fileExtension = utils.fileExtension(trimmedPath);  //f-ja failiuke urils.js, t.y. nustatom potencialiai kokia yra galune jei ji yra
    const textFileExtensions = ['css', 'js', 'svg', 'webmanifest', 'txt'];  //jei turim galune tai tikrinam ar ji yra pas mus cia sarase ir pagal sita nustatom koks cia failas tekstinis, binarinis...
    const binaryFileExtensions = ['jpg', 'png', 'ico'];
    const isTextFile = textFileExtensions.includes(fileExtension);
    const isBinaryFile = binaryFileExtensions.includes(fileExtension);
    const isAPI = trimmedPath.indexOf('api/') === 0;
    const isPage = !isTextFile && !isBinaryFile && !isAPI;

    const MIMES = {
        html: 'text/html',
        css: 'text/css',
        js: 'text/javascript',
        svg: 'image/svg+xml',
        png: 'image/png',
        jpg: 'image/jpeg',
        ico: 'image/x-icon',
        woff2: 'font/woff2',
        woff: 'font/woff',
        ttf: 'font/ttf',
        otf: 'font/otf',
        eot: 'application/vnd.ms-fontobject',
        webmanifest: 'application/manifest+json',
        pdf: 'application/pdf',
        json: 'application/json',
    };

    if (isTextFile) {
        const fileContent = await file.readPublic(trimmedPath);
        res.writeHead(200, {
            'Conten-Type': MIMES[fileExtension], //kreipiamias i musu objekta cnonst MIMES kuri nurodytas virsuj
        })  
        res.end(fileContent);
        return;
      //  console.log('Noriu tekstinio failo, klientas', trimmedPath);
      //  console.log('Realiai failas yra cia', 'public/' + trimmedPath);
     // const filePath='public/'+trimmedPath;
        //nietit i reikiama vieta, kur yra norimas failas
        //perskaityti failo turini / create, read, update
        //ta turini issiusti klientui
       // res.end('STAI TAU TEKSTINIS FAILAS...');
      //  return;
    }

    if (isBinaryFile) {
        res.writeHead(200, {
            'Conten-Type': MIMES[fileExtension],
        });
        res.end('STAI TAU BINARY FAILAS...');
        return;
    }

    if (isPage) {
        res.writeHead(200, {
            'Content-Type': MIMES.html,
        });
        res.end(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="/css/base/absoliutuskelais/style.css">
    <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon">
</head>
<body>
    <h1>Labas rytas 🎅</h1>
    <img src="./img/logo.png" alt="Logo">
    <script src="./js/main.js" defer></script>
</body>
</html>`);
        return;
    }

    // api/... svarbu kad prasidedu zodziu api
    // api/account arba api/item...
    if (isAPI) {
        res.writeHead(503, {
            'Conten-Type': MIMES.json,
        });
        res.end('STAI TAU API atsakymas...');
        return;
    }



});

server.init = () => {
    server.httpServer.listen(6969);
}

export { server };

//http://localhost:6969/css/base/base.css
// trimmedPath=css/base/base.css

//tikrasis kelias 