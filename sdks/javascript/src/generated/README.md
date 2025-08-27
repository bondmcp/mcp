## @bondmcp/sdk@1.0.1

This generator creates TypeScript/JavaScript client that utilizes [axios](https://github.com/axios/axios). The generated Node module can be used in the following environments:

Environment
* Node.js
* Webpack
* Browserify

Language level
* ES5 - you must have a Promises/A+ library installed
* ES6

Module system
* CommonJS
* ES6 module system

It can be used in both TypeScript and JavaScript. In TypeScript, the definition will be automatically resolved via `package.json`. ([Reference](https://www.typescriptlang.org/docs/handbook/declaration-files/consumption.html))

### Building

To build and compile the typescript sources to javascript use:
```
npm install
npm run build
```

### Publishing

First build the package then run `npm publish`

### Consuming

navigate to the folder of your consuming project and run one of the following commands.

_published:_

```
npm install @bondmcp/sdk@1.0.1 --save
```

_unPublished (not recommended):_

```
npm install PATH_TO_GENERATED_PACKAGE --save
```

### Documentation for API Endpoints

All URIs are relative to *https://api.bondmcp.com*

Class | Method | HTTP request | Description
------------ | ------------- | ------------- | -------------
*DefaultApi* | ****apiV1AskPost**** (CLI/API only) | **POST** /api/ask | Ask a health question
*DefaultApi* | ****apiV1HealthGet**** (CLI/API only) | **GET** /api/health | Health check endpoint
*DefaultApi* | ****apiV1SymptomsPost**** (CLI/API only) | **POST** /api/v1/symptoms | Analyze symptoms (NEW in v1.0.1)


### Documentation For Models

 - **ApiV1AskPost200Response** (CLI/API only)
 - **ApiV1AskPostRequest** (CLI/API only)
 - **ApiV1HealthGet200Response** (CLI/API only)
 - **ApiV1SymptomsPost200Response** (CLI/API only)
 - **ApiV1SymptomsPostRequest** (CLI/API only)


<a id="documentation-for-authorization"></a>
## Documentation For Authorization


Authentication schemes defined for the API:
<a id="ApiKeyAuth"></a>
### ApiKeyAuth

- **Type**: API key
- **API key parameter name**: X-API-Key
- **Location**: HTTP header

