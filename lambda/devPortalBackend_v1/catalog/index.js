const yaml = require('js-yaml'),
    config = require('../env'),
    aws = require('aws-sdk'),
    Promise = require('bluebird'),
    yamljs = require('yamljs'),
    strPromise = require('stream-to-promise');

aws.config.setPromisesDependency(Promise);

const s3 = new aws.S3();

function getSwaggerInfo(path) {
    let methodName = 'getSwaggerInfo';
    let params = {
        Bucket: config.swaggerBucket,
        Key: path
    };
    console.log({methodName, params}, "Reading swagger");
    let myReadStream = s3.getObject(params).createReadStream();
    return strPromise(myReadStream)
        .then( buf => {
            return yamljs.parse(buf.toString());
        })
        .then( d => d.info )
        .then( d => {
            console.log({d}, "the result of the swagger lookup");
            return {
                title: d.title ? d.title : 'swagger',
                version: d.version ? d.version : 'unversioned',
                description: d.description ? d.description : ''
            };
        });
}

function setAPIObject(api) {
    let apiName = api.Prefix.replace('/','');
    return getSwaggerInfo( `${apiName}/swagger.yaml` )
        .then( swagger => {
            return {
                id: apiName,
                image: '/api-icon.png',
                swaggerURL: config.swaggerURLRoot + api.Prefix + 'swagger.yaml',
                swagger: swagger
            };
        })
}

exports.listAPIs = () => {
    var methodName = "listAPIs";
    var params = {
        Bucket: config.swaggerBucket,
        Delimiter: "/",
        MaxKeys: config.maxKeys
    };
    console.log({methodName,params}, "about to call s3.list");
    return s3.listObjectsV2(params).promise()
        .tap( list => console.log({list, methodName},"Received this list"))
        .then( list => list.CommonPrefixes )
        .map(setAPIObject)
        .then( fullList => {
            return [
                {
                    id: 'A Usage Plan',
                    name: 'TheOneAndOnly',
                    apis: fullList
                }
            ];
        });
}
