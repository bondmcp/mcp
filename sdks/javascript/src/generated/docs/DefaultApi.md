# DefaultApi

All URIs are relative to *https://api.bondmcp.com*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**apiV1AskPost**](#apiv1askpost) | **POST** /api/v1/ask | Ask a health question|
|[**apiV1HealthGet**](#apiv1healthget) | **GET** /api/v1/health | Health check endpoint|
|[**apiV1SymptomsPost**](#apiv1symptomspost) | **POST** /api/v1/symptoms | Analyze symptoms (NEW in v1.0.1)|

# **apiV1AskPost**
> ApiV1AskPost200Response apiV1AskPost(apiV1AskPostRequest)


### Example

```typescript
import {
    DefaultApi,
    Configuration,
    ApiV1AskPostRequest
} from '@bondmcp/sdk';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let apiV1AskPostRequest: ApiV1AskPostRequest; //

const { status, data } = await apiInstance.apiV1AskPost(
    apiV1AskPostRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **apiV1AskPostRequest** | **ApiV1AskPostRequest**|  | |


### Return type

**ApiV1AskPost200Response**

### Authorization

**ApiKeyAuth** (CLI/API only)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Health answer |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiV1HealthGet**
> ApiV1HealthGet200Response apiV1HealthGet()


### Example

```typescript
import {
    DefaultApi,
    Configuration
} from '@bondmcp/sdk';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

const { status, data } = await apiInstance.apiV1HealthGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**ApiV1HealthGet200Response**

### Authorization

**ApiKeyAuth** (CLI/API only)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Service is healthy |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiV1SymptomsPost**
> ApiV1SymptomsPost200Response apiV1SymptomsPost(apiV1SymptomsPostRequest)


### Example

```typescript
import {
    DefaultApi,
    Configuration,
    ApiV1SymptomsPostRequest
} from '@bondmcp/sdk';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let apiV1SymptomsPostRequest: ApiV1SymptomsPostRequest; //

const { status, data } = await apiInstance.apiV1SymptomsPost(
    apiV1SymptomsPostRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **apiV1SymptomsPostRequest** | **ApiV1SymptomsPostRequest**|  | |


### Return type

**ApiV1SymptomsPost200Response**

### Authorization

**ApiKeyAuth** (CLI/API only)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Symptom analysis |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

