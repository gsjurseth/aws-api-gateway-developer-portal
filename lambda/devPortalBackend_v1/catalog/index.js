const yaml = require('js-yaml'),
    config = require('../env'),
    aws = require('aws-sdk'),
    Promise = require('bluebird'),
    bunyan = require('bunyan'),
    strPromise = require('stream-to-promise');

aws.config.setPromisesDependency(Promise);

const s3 = new aws.S3();

const log = bunyan.createLogger({
    name: 'ProofOfPurchase',
    level: process.env.loglevel ? process.env.loglevel : 'DEBUG',
    message: {}
});

function getSwaggerInfo(path) {
    let methodName = 'getSwaggerInfo';
    let params = {
        Bucket: config.swaggerBucket,
        Key: path
    };
    log.debug({methodName, params}, "Reading swagger");
    let myReadStream = s3.getObject(params).createReadStream();
    return strPromise(myReadStream)
        .then( buf => {
            //return yamljs.parse(buf.toString());
            return yaml.safeLoad(buf.toString());
        })
        .then( d => d.info )
        .then( d => {
            log.debug({d}, "the result of the swagger lookup");
            return {
                title: d.title ? d.title : 'swagger',
                version: d.version ? d.version : 'unversioned',
                description: d.description ? d.description : ''
            };
        });
}

function setAPIObject(swagger) {
    let apiName = swagger.split('/')[0];
    return getSwaggerInfo( swagger )
        .then( swaggerInfo => {
            return {
                id: apiName,
                image: '/api-icon.png',
                swaggerURL: config.swaggerURLRoot + swagger,
                swagger: swaggerInfo
            };
        })
}

exports.listAPIs = () => {
    var methodName = "listAPIs";
    var params = {
        Bucket: config.swaggerBucket,
        Delimiter: "/swagger.yaml",
        MaxKeys: config.maxKeys
    };

    log.debug({methodName,params}, "about to call s3.list");
    return s3.listObjectsV2(params).promise()
        .tap( list => log.debug({list, methodName},"Received this list"))
        .then( list => list.CommonPrefixes.map( i => i.Prefix ) )
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
