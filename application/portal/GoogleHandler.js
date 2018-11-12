const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
let upload = {name: '', stream: ''};
let call = null;
var streamBuffers = require('stream-buffers');
// If modifying these scopes, delete credentials.json.
const SCOPES = ['https://www.googleapis.com/auth/drive','https://www.googleapis.com/auth/drive.appfolder','https://www.googleapis.com/auth/drive.file','https://www.googleapis.com/auth/drive.install','https://www.googleapis.com/auth/drive.metadata','https://www.googleapis.com/auth/drive.scripts'];
const TOKEN_PATH = __dirname + '/token.json';
const FILE_PATH = __dirname + '/tmp/file.pdf';
let express = require('express')
let router = express.Router()
const bodyParser = require('body-parser');

// Load client secrets from a local file.
// fs.readFile( __dirname + '/credentials.json', (err, content) => {
//   if (err) return console.log('Error loading client secret file:', err);
//   // Authorize a client with credentials, then call the Google Drive API.
//   authorize(JSON.parse(content), listFiles);
// });

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize (credentials, callback) {
    const {client_secret, client_id, redirect_uris} = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) {return getAccessToken(oAuth2Client, callback);}
        oAuth2Client.setCredentials(JSON.parse(token));
        callback(oAuth2Client);
    });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getAccessToken (oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
            if (err) {return callback(err);}
            oAuth2Client.setCredentials(token);
            // Store the token to disk for later program executions
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                if (err) {console.error(err);}
                console.log('Token stored to', TOKEN_PATH);
            });
            callback(oAuth2Client);
        });
    });
}

/**
 * Lists the names and IDs of up to 10 files.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listFiles (auth) {
    const drive = google.drive({version: 'v3', auth});
    drive.files.list({
        pageSize: 10,
        fields: 'nextPageToken, files(id, name)',
    }, (err, res) => {
        if (err) {return console.log('The API returned an error: ' + err);}
        const files = res.data.files;
        if (files.length) {
            console.log('Files:');
            files.map((file) => {
                console.log(`${file.name} (${file.id})`);
            });
        } else {
            console.log('No files found.');
        }
    });
}


function uploadFile (auth) {
    const drive = google.drive({version: 'v3', auth});
    var fileMetadata = {
        'name': upload.name,
        'mimeType': 'application/pdf'
    };
    var myWritableStreamBuffer = new streamBuffers.WritableStreamBuffer({
        initialSize: (100 * 1024), // start at 100 kilobytes.
        incrementAmount: (10 * 1024) // grow by 10 kilobytes each time buffer overflows.
    });
    var check = 'data:application/pdf;base64,';
    var index = upload.base64.lastIndexOf(check);
    base64_decode(upload.base64.substring(index + check.length), FILE_PATH); // upload.base64.substring(index + check.length)
    var media = {
        mimeType: 'application/pdf',
        body: fs.createReadStream(FILE_PATH)
    };
    drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id'
    }, function (err, file) {
        fs.unlink(FILE_PATH, (err) => {
            console.log('successfully deleted', err);
        });
        if (err) {
            // Handle error
            console.error(err);
            call.send({code: '06', message: err.message || err });
        } else {
            console.log('File Id:', file.data.id);
            call.send({code: '00', message: 'success', data: file.data });
        //   return file;
        }
    });
}

// function to encode file data to base64 encoded string
function base64_encode (file, callback) {
    // read binary data
    var bitmap = fs.readFileSync(file, {encoding: 'base64'});
    // convert binary data to base64 encoded string
    // var base64 = new Buffer(bitmap, 'binary').toString('base64');
    // var base64 = bitmap.toString('base64');

    // bitmap = bitmap.replace(/_/g, '/');
    // bitmap = bitmap.replace(/-/g, '+');
    callback(bitmap);
}

// function to create file from base64 encoded string
function base64_decode (base64str, file) {
    // create buffer object from base64 encoded string, it is important to tell the constructor that the string is base64 encoded
    var bitmap = new Buffer(base64str, 'base64');
    // write buffer to file
    fs.writeFileSync(file, bitmap);
    console.log('******** File created from base64 encoded string ********');
}
function getFile (auth) {
    const drive = google.drive({version: 'v3', auth});
    console.log(upload.fileId)
    var dest = fs.createWriteStream(FILE_PATH);
    drive.files.get({
        fileId: upload.fileId,
        alt: 'media',
        mimeType: 'application/pdf'
    },
    {
        responseType: 'stream'
    },
    function (err, response) {
        if (err) {
            console.log('Error during download', err);
            call.send({code: '06', message: err.message || err });
        } else {
        
            response.data.on('error', err => {
                console.log('Error during download', err);
                call.send({code: '06', message: err.message || err });
            }).on('end', () => {
                console.log('Done');
                base64_encode(FILE_PATH, function(base64) {
                    call.send({code: '00', message: 'success', data: base64});
                });
            })
                .pipe(dest);
        }
    });
/*     drive.files.get({
        fileId: upload.fileId,
        alt: 'media',
        // mimeType: 'application/pdf'
    }, (err, file) => {
        if (!err) {
            var base64 = base64_encode(FILE_PATH);
            call.send({code: '00', message: 'success', data: {uri: 'data:application/pdf;base64,' + base64}});
        } else {
            console.log('Error during download', err);
            call.send({code: '06', message: err.message || err });
        }
    }) */
}

router.post('/google/download', function (req, res) {
    upload = req.body;
    fs.readFile(__dirname + '/credentials.json', (err, content) => {
        if (err) {
            console.log('Error loading client secret file:', err);
            res.send({code: '06', message: err.message || err });
        } else {
            call = res;
            // Authorize a client with credentials, then call the Google Drive API.
            authorize(JSON.parse(content), getFile);

        }
    });
})

router.post('/google/upload', function (req, res) {
    upload = req.body;
    fs.readFile(__dirname + '/credentials.json', (err, content) => {
        if (err) {
            console.log('Error loading client secret file:', err);
            res.send({code: '06', message: err.message || err });
        } else {
            call = res;
            // Authorize a client with credentials, then call the Google Drive API.
            authorize(JSON.parse(content), uploadFile);

        }
    });
})

module.exports = router