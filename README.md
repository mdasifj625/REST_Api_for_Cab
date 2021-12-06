# REST_Api_for_Cab

### This API is created using following technologies and framework.

**_ JavaScript(Node.js)
_** express
**_ mongoose(mongoDb)
_** mongoose(mongoDb)

# API Usage

This api has endpoints that can be used to book and manage cab.

# Implementation in you system

### You can follow the following steps

**_ Clone the repository.
_** Install all the dependencies using npm command (npm install).
**_ Run your local database and create a "config.env" file.
_** run command "npm start" to run the the code.

### config file should contain following data

**_ NODE_ENV=development or NODE_ENV=production
_** PORT=3000
\*\*\* DATABASE_LOCAL=mongodb://localhost:27017/api_for_business

**_ JWT_SECRET=ThisIsTheSecretCodeForToken
_** JWT_EXPIRES_IN=30d
\*\*\* JWT_COOKIE_EXPIRES_IN=90

# Swagger Documentation

use **_/api-docs_** path in browser to refer swagger documentation and try endpoints.
or you can use live url hosted on heroku: https://rest-api-cab.herokuapp.com/api-docs/

# Postman Documentation

Please refer Postman documentation link: https://documenter.getpostman.com/view/16860081/UVJigDtt

# Hosted on heroku

This is base url you can follow all the endpoints here: https://rest-api-cab.herokuapp.com/