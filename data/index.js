const request = require('request');
const async = require('async');
const fs = require('fs');

step_1().then( (version_numbers)=> {
    //console.log(version_numbers)

    var tasks = [];

    version_numbers.forEach( function(version) {
        
        let v = version;

        var task = function(callback) {

            var options = {
                url: 'https://raw.githubusercontent.com/jashkenas/underscore/' + version + '/underscore.js',
                headers: {
                    'User-Agent': 'request'
                }
            };

            request(options, function(err,res,body) { 

                if(err) {

                }

                var file = '../vis/data/underscore_' + version + '.js';

                try { 
                    fs.unlinkSync('file');
                } catch(e) {
                    console.log("No file to delete")
                }

                appendToFile(file, body).then( function() {
                    callback(null);
                })

            });

        }

        tasks.push(task);
    });

    async.series(tasks)
});


function step_1() {
    var promise = new Promise( (resolve,reject) => {

        var options = {
            url: 'https://api.github.com/repos/jashkenas/underscore/tags',
            headers: {
                'User-Agent': 'request'
            }
        };

        request(options, function(err,res,body) {

            if(err) {
                reject(err);
            }

            var parsed = JSON.parse(body)

            var version_numbers = parsed.filter( (el) => { return el.name.indexOf('-') === -1; } );
            version_numbers = version_numbers.map( (el) => { return el.name; });

            resolve(version_numbers);
        });


    });

    return promise;
}


function appendToFile(path, data) {
    var promise = new Promise( function(resolve,reject) {
        
        fs.appendFile(path, data, function (err) {
            if(!err) {
                resolve()
            } else {
                reject()
            }
        }); 
    })

    return promise;
}