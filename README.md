# BondMCP - Medical Context Protocol

BondMCP is a healthcare AI protocol that eliminates hallucinations by creating verified consensus across multiple AI models, serving as a trusted layer for all health AI interactions.

## Features

- 🏥 Healthcare-Optimized
- 🔒 HIPAA Compliant
- ⚡ Sub-3 second response times
- 🎯 High accuracy rate
- 🔧 Multi-language SDK support

## Documentation

Comprehensive documentation is available at [docs.bondmcp.com](https://docs.bondmcp.com).

## API Resources

- **API Documentation**: [docs.bondmcp.com](https://docs.bondmcp.com)
- **OpenAPI Specification**: [openapi.bondmcp.com/openapi.json](https://openapi.bondmcp.com/openapi.json)
- **Swagger UI**: [swagger.bondmcp.com](https://swagger.bondmcp.com)
- **Postman Collection**: [postman.bondmcp.com](https://postman.bondmcp.com)

## API Endpoints

For a complete list of available endpoints, see [ENDPOINTS.md](./ENDPOINTS.md).

## OpenAPI Specification

The OpenAPI specification is automatically synced from our production API to this repository. The sync workflow runs every 6 hours and ensures that this repository always contains the most up-to-date API definition.

### OpenAPI Sync Workflow

We maintain a bidirectional sync between our API implementation and this repository:

1. **S3 to Repository Sync**: The [openapi-s3-to-repo-sync.yml](./.github/workflows/openapi-s3-to-repo-sync.yml) workflow pulls the latest OpenAPI specification from our S3 bucket and updates the repository.

2. **Repository to S3 Sync**: The [openapi-sync.yml](./.github/workflows/openapi-sync.yml) workflow pushes changes from the repository to our S3 bucket and updates the Swagger UI and Postman collection.

## Contact

**US Office:**  
111 NE 1st St, STE 89079, 33132, Miami, Florida  
Phone: +1 855 512 5310

**Hong Kong Office:**  
144-151 Connaught Road West, Unit 4005, 40/F, Sai Ying Pun, Hong Kong

**Company:** Lifecycle Innovations Limited (Brand: BondMCP)

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
