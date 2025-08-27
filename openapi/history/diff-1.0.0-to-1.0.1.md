# API Changes: 1.0.0 to 1.0.1

## Summary
This document outlines the changes between API version 1.0.0 and 1.0.1.

## New Endpoints
- `POST /api/v1/symptoms` - Analyze symptoms (NEW in v1.0.1)

## Modified Endpoints
None

## Removed Endpoints
None

## Schema Changes
- Added `SymptomAnalysisRequest` schema
- Added `SymptomAnalysisResponse` schema

## Breaking Changes
None - this is a minor version update with only new features added.

## Migration Impact
- **Low** - Only new functionality added
- No breaking changes to existing endpoints
- Existing client code will continue to work without modification
