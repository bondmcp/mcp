# BondMCP Project Documentation

## Introduction

Welcome to the BondMCP (Model Context Protocol + Trust Layer for Health AI) project. This documentation serves as the central hub for understanding the BondMCP platform, its architecture, features, APIs, and development guidelines. It is intended for developers, contributors, and anyone looking to integrate with or understand BondMCP.

## Table of Contents

1.  [Project Overview](#1-project-overview)
    *   [Mission and Vision](#mission-and-vision)
    *   [Key Domains](#key-domains)
2.  [System Architecture](#2-system-architecture)
    *   [High-Level Design](#high-level-design)
    *   [Backend Services (FastAPI)](#backend-services-fastapi)
    *   [Frontend Applications (Next.js)](#frontend-applications-nextjs)
    *   [AWS Infrastructure](#aws-infrastructure)
3.  [Core Features](#3-core-features)
4.  [API Reference](#4-api-reference)
    *   [Accessing the API](#accessing-the-api)
    *   [Authentication (Cognito & API Keys)](#authentication-cognito--api-keys)
    *   [Key Endpoints Overview](#key-endpoints-overview)
    *   [Detailed Endpoint Specifications & Examples](#detailed-endpoint-specifications--examples)
    *   [Rate Limiting](#rate-limiting)
    *   [Error Handling](#error-handling)
5.  [Software Development Kits (SDKs)](#5-software-development-kits-sdks)
6.  [Developer Guide](#6-developer-guide)
    *   [Getting Started with the API](#getting-started-with-the-api)
    *   [Working with the Trust Layer](#working-with-the-trust-layer)
    *   [API Integration Best Practices](#api-integration-best-practices)
    *   [Illustrative Use Cases](#illustrative-use-cases)
7.  [Infrastructure as Code (Terraform)](#7-infrastructure-as-code-terraform)
    *   [Overview and Structure](#overview-and-structure)
    *   [Key Modules](#key-modules)
    *   [Deployment Process](#deployment-process)
8.  [Contribution Guidelines](#8-contribution-guidelines)
9.  [Changelog](#9-changelog)

## 1. Project Overview

### Mission and Vision
BondMCP is a comprehensive platform designed to transform complex and often unstructured health data into validated, actionable decisions. The core mission of BondMCP is to provide a unified "language" that can be understood and trusted by diverse systems, including wearables, hospital EMRs, consumer health applications, and laboratory information systems. By enforcing rigorous cross-model validation (utilizing a minimum of three Large Language Models), semantic grounding through verifiable sources, and offering public APIs, BondMCP aims to become the internet's trust layer for health. This ensures that insights and recommendations derived from health data are not only intelligent but also reliable and precise, fostering greater confidence in AI-driven healthcare solutions.

### Key Domains
**Unified Developer Portal:
`api.bondmcp.com` serves as the unified developer command center. It will consolidate all developer-facing functionalities, including:
*   An interactive API explorer (Swagger UI/OpenAPI).
*   Downloadable Software Development Kits (SDKs).
*   Demonstrations of core capabilities (Playground)
*   An interactive API sandbox for live testing of endpoints.
*   Developer account registration and management.
*   API key generation and management.
*   Billing and subscription management.

**Main Website: `bondmcp.com`**
*   This domain functions as the main informational website, featuring product details, thought leadership content, and general company information.

## 2. System Architecture

### High-Level Design
The BondMCP system is architected as a robust, cloud-native platform leveraging a multi-layer AI algorithm for scalability, reliability, and security. The architecture is designed to support a high volume of API requests, complex data processing, and real-time interactions, while ensuring data integrity and compliance with health data standards.

### Backend Services (FastAPI)
The backend of BondMCP is built using FastAPI, a modern, high-performance Python web framework. This choice allows for rapid development, automatic data validation, and interactive API documentation generation (following OpenAPI standards).


## 3. Core Features

BondMCP offers a suite of powerful features designed to provide trusted, AI-driven health insights:
*   **Trusted Health Insights:** Ensemble LLM validation (Claude 3, GPT-4o, MedLM, etc) with Titan-Med and BioGator embeddings.
*   **Lab Result Analysis & Interpretation:** AI-powered interpretation of lab results, identifying out-of-range markers and providing context.
*   **Supplement Recommendation Engine:** Personalized supplement recommendations based on health data, including planned drug-interaction checks.
*   **Wearable Data Ingestion & Analysis:** Support for Oura (CSV) and Apple Health data integration.
*   **Retrieval Augmented Generation (RAG):** PubMed-backed RAG for evidence-based health query answers.
*   **ClinicalTrace Dashboard:** Transparency and traceability for AI-generated insights.
*   **Developer-Friendly API & SDKs:** Comprehensive REST API (OpenAPI) with planned Node.js and Python SDKs.
*   **Secure Authentication & Authorization:** AWS Cognito (OAuth2) and API key management.
*   **Comprehensive Data Management:** Aurora PostgreSQL with pgvector for structured data and vector embeddings.
*   **Integration with Comprehend Medical:** Advanced NER and clinical entity extraction.

## 4. API Reference

### Accessing the API
The BondMCP API provides programmatic access to its suite of health AI features. The API is designed following RESTful principles and uses JSON for request and response bodies. Comprehensive, interactive API documentation is available via the embedded OpenAPI specification (Swagger UI) on the `api.bondmcp.com` developer portal.

**Important Note on OpenAPI Specification:** BondMCP's FastAPI application dynamically generates the definitive OpenAPI schema. For the most accurate and up-to-date API development and documentation, always refer to the OpenAPI schema exposed by the live `api.bondmcp.com/openapi.json' service.

### Authentication (Cognito & API Keys)
Access to the BondMCP API is secured using API keys and OAuth2 through AWS Cognito. All related management tasks, including API key generation and Cognito user account management, are handled within the unified `api.bondmcp.com` developer portal.

*   **API Keys:** For server-to-server communication, include the API key in the `X-API-Key` HTTP header. These keys are generated and managed via your developer account on the `api.bondmcp.com` portal.
*   **OAuth2 (Cognito):** For user-centric flows and access to the developer portal features, BondMCP utilizes AWS Cognito. Authenticated users receive JWTs (ID and Access Tokens) which should be sent as a Bearer token in the `Authorization` HTTP header for relevant API calls. Detailed OAuth2 flow information is available via the Cognito User Pool configuration and the developer portal at `api.bondmcp.com`.

###
### Detailed Endpoint Specifications & Examples
This section details the primary endpoints identified in the BondMCP FastAPI application (`app/main.py`). For the most comprehensive and interactive documentation, refer to the OpenAPI specification generated by the live application (typically at `/docs` or `/redoc` on the `api.bondmcp.com` service).

TO BE UPDATED

## 5. Software Development Kits (SDKs)

TO BE UPDATED

These SDKs will provide convenient wrappers around the API endpoints, handle authentication, and simplify request/response processing. Links to the SDK repositories on GitHub and their respective documentation will be provided on `api.bondmcp.com` once available. Downloadable ZIP bundles of example SDK usage will also be provided in the `/downloads` section of the developer portal.

## 6. Developer Guide

### Getting Started with the API
1.  **Register for an Account:** Visit the unified developer portal at `api.bondmcp.com` to create your developer account. This will give you access to the API documentation, interactive playground, API key management, and billing information.
2.  **Obtain API Credentials:** Once registered and logged in, navigate to the API key management section within your `api.bondmcp.com` dashboard to generate your API key.
3.  **Review API Documentation:** Familiarize yourself with the API endpoints, request/response schemas, and authentication methods detailed on `api.bondmcp.com`.
4.  **Utilize SDKs (Recommended):** Check the [SDKs section](#5-software-development-kits-sdks) for available SDKs to simplify your integration.
5.  **Make Your First API Call:** Test your setup by calling a simple endpoint, such as `/health`, or an endpoint relevant to your use case, using your generated API key. Example cURL for a generic endpoint: `curl -H "X-API-Key: YOUR_API_KEY" https://api.bondmcp.com/tools/call` (replace with actual tool name and arguments).
6.  **Explore Use Cases & Playground:** Dive into the [Illustrative Use Cases](#illustrative-use-cases) and experiment with the interactive API playground on `api.bondmcp.com` to better understand the API's capabilities.

### Working with the Trust Layer
BondMCP's Trust Layer ensures reliable AI insights through:
*   **Multi-Model Validation:** Outputs are processed by an ensemble of LLMs via AWS Bedrock.
*   **Semantic Grounding & Source Traceability:** API responses may include source references (e.g., PubMed).
*   **Confidence Scores:** Some endpoints may return confidence scores for predictions.

### API Integration Best Practices
*   **Secure Credentials:** Never embed API keys in client-side code. Use environment variables or secure backend storage.
*   **Handle Asynchronous Operations:** Design for long-running API calls using webhooks or polling with backoff.
*   **Ensure Input Data Quality:** Accurate input leads to quality insights.
*   **Implement Robust Error Handling & Retries:** Handle errors gracefully and retry transient issues (429, 503) with exponential backoff.
*   **Client-Side Logging:** Log API requests/responses (excluding sensitive data) for debugging.
*   **Stay Updated:** Check `api.bondmcp.com` and the [Changelog](#9-changelog) for updates.

## 7. Contribution Guidelines

We welcome contributions! Please follow these guidelines:
1.  **Fork & Branch:** Fork `bondmcp/mcp`, create a feature branch from `main`.
2.  **Coding Standards:** TypeScript (frontend), Python (backend). Adhere to existing style; use linters/formatters.
3.  **Unit Tests:** Accompany new features/fixes with unit tests.
4.  **Commit Messages:** Clear, concise, conventional if possible.
5.  **Pre-commit Hooks:** Ensure they pass.
6.  **Update Documentation:** Reflect changes in this README.
7.  **Pull Request (PR):** Submit PR to `main` with a clear description.
8.  **Code Review:** Address feedback.
9.  **Merge:** Core team merges upon approval.
