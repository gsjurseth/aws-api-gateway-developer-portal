#!/usr/bin/python
import urllib2
import json
import os

def httpRequest(url,headers):
    req = urllib2.Request(url,headers=headers)
    response = urllib2.urlopen(req)
    responseData = response.read()
    return responseData;

def readFile(fileName):
    data = None;
    try:
        fh = open(fileName, 'r')
        data = fh.read()
        fh.close()
    except:
        print "Warning: " +fileName+ " doesn't exist. Ignoring it."
    return data;

def parseMetadataJson(jsonString):
    try:
        return json.loads(jsonString)
    except:
        print "Error: " +"'"+fileName + "' is not a valid json"

def extractMetadataJsonAttribute(jsonObject,fileName,attribute):
    if 'UserData' in jsonObject:
        if attribute in jsonObject['UserData']:
            return jsonObject['UserData'][attribute]
    print "Error: " +"UserData."+attribute+ " attribute missing in " +fileName

def saveSwaggerAPI(basePath,apiContent):
    swaggerFile= open(basePath+"/api.json",'wb')
    result = swaggerFile.write(apiContent)
    return result;

def readAPIFolders():
    dirs = next(os.walk("./"))[1]
    return dirs;

#Entry point to the program
for api in readAPIFolders():
    print "Downloading swagger file for "+ api
    fileName = api+'/metadata.json';
    data = readFile(fileName)
    if data is not None:
        jsonObj = parseMetadataJson(data)
        url = extractMetadataJsonAttribute(jsonObj,fileName, "SourceURL")
        key = extractMetadataJsonAttribute(jsonObj,fileName,"SwaggerAuthKey")
        headers = {'Authorization': key}
        if url is not None and key is not None:
            apiContent = httpRequest(url , headers)
            saveSwaggerAPI(api, apiContent)
            print "DONE!!!"

