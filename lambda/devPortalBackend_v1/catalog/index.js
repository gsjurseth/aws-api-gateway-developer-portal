const yaml = require('js-yaml'),
    config = require('../env'),
    aws = require('aws-sdk'),
    Promise = require('bluebird');

aws.config.setPromisesDependency(Promise);

const s3 = new aws.S3();
// Load Swagger as JSON
// const petStoreSwaggerDefinition = require('./pet-store-prod.json')

// Load Swagger as YAML
//
/*
const usagePlans = [{
  id: 'YOUR_USAGE_PLAN_ID',
  name: 'Free',
  apis: [{
    id: 'YOUR_API_ID',
    image: '/sam-logo.png',
    swagger: petStoreSwaggerDefinition
  }]
}]
*/

exports.listAPIs = () => {
    var methodName = "listS3Files";
    var params = {
        Bucket: config.swaggerBucket,
        Delimiter: "/",
        MaxKeys: config.maxKeys
    };
    console.log({methodName,params}, "about to call s3.list");
    return s3.listObjectsV2(params).promise()
        .tap( list => console.log({list, methodName},"Received this list"))
        .then( list => list.CommonPrefixes )
        .map( api => {
            let apiName = api.Prefix.replace('/','');
            return {
                id: apiName,
                image: '/sam-logo.png',
                swaggerURL: config.swaggerURLRoot + api.Prefix + 'swagger.yaml',
                swagger: {
                    "info": {
                        "version": 1,
                        "title": "someTitle",
                        "description": "an api yo"
                    }
                }
            };
        })
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
