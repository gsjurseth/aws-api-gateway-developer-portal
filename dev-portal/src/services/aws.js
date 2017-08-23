import AWS from 'aws-sdk'
export const awsRegion = 'eu-west-1'
export const cognitoRegion = 'eu-west-1'
export const cognitoUserPoolId = 'eu-west-1_ALFRdHXWT'
export const cognitoIdentityPoolId = 'YOUR_COGNITO_IDENTITY_POOL_ID'
export const cognitoClientId = 'YOUR_COGNITO_CLIENT_ID'

AWS.config.region = cognitoRegion
