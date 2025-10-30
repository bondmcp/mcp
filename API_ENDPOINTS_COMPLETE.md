# BondMCP API - Complete Endpoint Reference

**Version**: 2.1.0

**Base URL**: https://api.bondmcp.com

**Total Endpoints**: 75



## API Keys

### POST `/api-keys/generate`

**Summary**: Generate Api Key Endpoint


Generate a new API key



### POST `/api/v1/api-keys/create`

**Summary**: Create Api Key


Create a new API key - requires active subscription



### POST `/api/v1/api-keys/create`

**Summary**: Create Api Key


Create a new API key - requires active subscription



### GET `/api/v1/api-keys/list`

**Summary**: List Api Keys


List user's API keys



### GET `/api/v1/api-keys/list`

**Summary**: List Api Keys


List user's API keys



### GET `/api/v1/api-keys/usage/{key_id}`

**Summary**: Get Api Key Usage


Get API key usage statistics



### GET `/api/v1/api-keys/usage/{key_id}`

**Summary**: Get Api Key Usage


Get API key usage statistics



### DELETE `/api/v1/api-keys/{key_id}`

**Summary**: Delete Api Key


Delete an API key



### DELETE `/api/v1/api-keys/{key_id}`

**Summary**: Delete Api Key


Delete an API key



### POST `/api/v1/api-keys/{key_id}/regenerate`

**Summary**: Regenerate Api Key


Regenerate an API key - requires active subscription



### POST `/api/v1/api-keys/{key_id}/regenerate`

**Summary**: Regenerate Api Key


Regenerate an API key - requires active subscription




## Admin

### GET `/admin/ai-usage`

**Summary**: Get Ai Usage Stats


Get AI usage statistics and costs



### GET `/api/v1/admin/analytics`

**Summary**: Get Analytics


Get system analytics (admin only)



### GET `/api/v1/admin/analytics`

**Summary**: Get Analytics


Get system analytics (admin only)



### GET `/api/v1/admin/system-health`

**Summary**: Get System Health


Get system health status (admin only)



### GET `/api/v1/admin/system-health`

**Summary**: Get System Health


Get system health status (admin only)



### GET `/api/v1/admin/users`

**Summary**: Get Users


Get list of users (admin only)



### GET `/api/v1/admin/users`

**Summary**: Get Users


Get list of users (admin only)




## Appointments

### GET `/api/v1/appointments`

**Summary**: Get Appointments


Get list of appointments



### GET `/api/v1/appointments`

**Summary**: Get Appointments


Get list of appointments



### POST `/api/v1/appointments`

**Summary**: Create Appointment


Create a new appointment



### POST `/api/v1/appointments`

**Summary**: Create Appointment


Create a new appointment



### GET `/api/v1/appointments/available-slots`

**Summary**: Get Available Slots


Get available appointment slots



### GET `/api/v1/appointments/available-slots`

**Summary**: Get Available Slots


Get available appointment slots



### GET `/api/v1/appointments/{appointment_id}`

**Summary**: Get Appointment


Get appointment by ID



### GET `/api/v1/appointments/{appointment_id}`

**Summary**: Get Appointment


Get appointment by ID



### DELETE `/api/v1/appointments/{appointment_id}`

**Summary**: Delete Appointment


Delete appointment



### DELETE `/api/v1/appointments/{appointment_id}`

**Summary**: Delete Appointment


Delete appointment



### POST `/api/v1/appointments/{appointment_id}/cancel`

**Summary**: Cancel Appointment


Cancel appointment



### POST `/api/v1/appointments/{appointment_id}/cancel`

**Summary**: Cancel Appointment


Cancel appointment




## Authentication

### GET `/auth/api-keys`

**Summary**: Get Api Keys


Get user's API keys



### GET `/auth/api-keys`

**Summary**: Get Api Keys


Get user's API keys



### POST `/auth/api-keys`

**Summary**: Create Api Key


Create new API key with billing enforcement



### POST `/auth/api-keys`

**Summary**: Create Api Key


Create new API key with billing enforcement



### DELETE `/auth/api-keys/{key_id}`

**Summary**: Delete Api Key


Delete API key



### DELETE `/auth/api-keys/{key_id}`

**Summary**: Delete Api Key


Delete API key



### POST `/auth/login`

**Summary**: Login User


User login endpoint



### POST `/auth/login`

**Summary**: Login User


User login endpoint



### POST `/auth/logout`

**Summary**: Logout User


User logout endpoint - blacklists the JWT token



### POST `/auth/logout`

**Summary**: Logout User


User logout endpoint - blacklists the JWT token



### GET `/auth/me`

**Summary**: Get User Profile


Get current user profile



### GET `/auth/me`

**Summary**: Get User Profile


Get current user profile



### GET `/auth/profile`

**Summary**: Get Profile


Get current user profile



### GET `/auth/profile`

**Summary**: Get Profile


Get current user profile



### POST `/auth/refresh`

**Summary**: Refresh Token


Refresh JWT token



### POST `/auth/refresh`

**Summary**: Refresh Token


Refresh JWT token



### POST `/auth/register`

**Summary**: Register User


User registration endpoint



### POST `/auth/register`

**Summary**: Register User


User registration endpoint



### POST `/auth/verify`

**Summary**: Verify Token


Verify token validity



### POST `/auth/verify`

**Summary**: Verify Token


Verify token validity




## Billing

### GET `/billing/invoices`

**Summary**: Get Invoices


Get billing invoices from Stripe



### GET `/billing/invoices`

**Summary**: Get Invoices


Get billing invoices from Stripe



### GET `/billing/payment-methods`

**Summary**: Get Payment Methods


Get customer's payment methods



### GET `/billing/payment-methods`

**Summary**: Get Payment Methods


Get customer's payment methods



### POST `/billing/payment-methods`

**Summary**: Attach Payment Method


Attach payment method to customer and set as default



### POST `/billing/payment-methods`

**Summary**: Attach Payment Method


Attach payment method to customer and set as default



### PUT `/billing/plan`

**Summary**: Update Subscription Plan


Create or update subscription plan
Handles upgrades, downgrades, and pro-ration



### PUT `/billing/plan`

**Summary**: Update Subscription Plan


Create or update subscription plan
Handles upgrades, downgrades, and pro-ration



### GET `/billing/plans`

**Summary**: Get Subscription Plans


Get available subscription plans



### GET `/billing/plans`

**Summary**: Get Subscription Plans


Get available subscription plans



### POST `/billing/setup`

**Summary**: Setup Billing


Set up billing for a user
- Creates Stripe customer if needed
- Returns setup intent for adding payment method



### POST `/billing/setup`

**Summary**: Setup Billing


Set up billing for a user
- Creates Stripe customer if needed
- Returns setup intent for adding payment method



### GET `/billing/subscription`

**Summary**: Get Subscription


Get current subscription details from database and Stripe



### GET `/billing/subscription`

**Summary**: Get Subscription


Get current subscription details from database and Stripe




## Core

### GET `/`

**Summary**: Root


Root endpoint with API information



### GET `/health`

**Summary**: Health Check


Basic liveness check endpoint - returns if API is running



### GET `/ready`

**Summary**: Readiness Check


Readiness check with comprehensive dependency validation

Checks:
- Database connectivity
- Cache availability
- External service health
- Configuration validity



### GET `/version`

**Summary**: Version Info


Version endpoint with git SHA and build time information




## Digital Programs

### GET `/api/v1/digital-programs`

**Summary**: Get Digital Programs


Get list of digital health programs



### GET `/api/v1/digital-programs`

**Summary**: Get Digital Programs


Get list of digital health programs



### GET `/api/v1/digital-programs/{program_id}`

**Summary**: Get Digital Program


Get digital program by ID



### GET `/api/v1/digital-programs/{program_id}`

**Summary**: Get Digital Program


Get digital program by ID



### POST `/api/v1/digital-programs/{program_id}/enroll`

**Summary**: Enroll In Program


Enroll in a digital health program



### POST `/api/v1/digital-programs/{program_id}/enroll`

**Summary**: Enroll In Program


Enroll in a digital health program




## Health

### GET `/health/allergies`

**Summary**: Get Allergies


Get allergies list



### POST `/health/allergies`

**Summary**: Submit Allergies


Submit allergies data



### GET `/health/check`

**Summary**: Health Check


Simple health check endpoint



### GET `/health/conditions`

**Summary**: Get Conditions


Get medical conditions list



### POST `/health/conditions`

**Summary**: Submit Conditions


Submit medical conditions data



### GET `/health/medications`

**Summary**: Get Medications


Get medications list



### POST `/health/medications`

**Summary**: Submit Medications


Submit medications data



### GET `/health/symptoms`

**Summary**: Get Symptoms


Get symptoms history



### POST `/health/symptoms`

**Summary**: Submit Symptoms


Submit symptoms data



### GET `/health/vitals`

**Summary**: Get Vitals


Get vital signs history



### POST `/health/vitals`

**Summary**: Submit Vitals


Submit vital signs data




## Health AI

### GET `/`

**Summary**: Root


Root endpoint with API information



### GET `/health`

**Summary**: Health Check


Basic liveness check endpoint - returns if API is running



### GET `/health/allergies`

**Summary**: Get Allergies


Get allergies list



### POST `/health/allergies`

**Summary**: Submit Allergies


Submit allergies data



### POST `/health/bloodwork`

**Summary**: Analyze Bloodwork


Analyze bloodwork results with AI



### GET `/health/check`

**Summary**: Health Check


Simple health check endpoint



### GET `/health/conditions`

**Summary**: Get Conditions


Get medical conditions list



### POST `/health/conditions`

**Summary**: Submit Conditions


Submit medical conditions data



### POST `/health/dna`

**Summary**: Analyze Dna


Analyze DNA/genetic data with AI for health predispositions



### POST `/health/fitness`

**Summary**: Analyze Fitness


Analyze fitness data with AI



### GET `/health/medications`

**Summary**: Get Medications


Get medications list



### POST `/health/medications`

**Summary**: Submit Medications


Submit medications data



### POST `/health/nutrition`

**Summary**: Analyze Nutrition


Analyze nutrition data with AI



### POST `/health/risk`

**Summary**: Assess Health Risk


Assess health risks with AI based on medical history and lifestyle



### GET `/health/status`

**Summary**: Health Ai Status


Get Health AI service status



### GET `/health/status`

**Summary**: Health Ai Status


Get Health AI service status



### GET `/health/symptoms`

**Summary**: Get Symptoms


Get symptoms history



### POST `/health/symptoms`

**Summary**: Submit Symptoms


Submit symptoms data



### GET `/health/vitals`

**Summary**: Get Vitals


Get vital signs history



### POST `/health/vitals`

**Summary**: Submit Vitals


Submit vital signs data



### GET `/ready`

**Summary**: Readiness Check


Readiness check with comprehensive dependency validation

Checks:
- Database connectivity
- Cache availability
- External service health
- Configuration validity



### GET `/version`

**Summary**: Version Info


Version endpoint with git SHA and build time information




## Lab Reference

### GET `/api/v1/reference/labs`

**Summary**: Get Lab References


Get list of lab reference values



### GET `/api/v1/reference/labs/{lab_id}`

**Summary**: Get Lab Reference


Get lab reference by ID




## MCP

### GET `/mcp/.well-known/mcp-configuration`

**Summary**: MCP Configuration


Get MCP configuration with all available capabilities



### GET `/mcp/.well-known/mcp-configuration`

**Summary**: MCP Configuration


Get MCP configuration with all available capabilities



### GET `/mcp/.well-known/mcp-manifest.json`

**Summary**: MCP Manifest


Get MCP manifest with capability integrity hash



### GET `/mcp/.well-known/mcp-manifest.json`

**Summary**: MCP Manifest


Get MCP manifest with capability integrity hash




## Medical Records

### GET `/api/v1/medical-records`

**Summary**: Get Medical Records


Get list of medical records



### GET `/api/v1/medical-records`

**Summary**: Get Medical Records


Get list of medical records



### POST `/api/v1/medical-records`

**Summary**: Create Medical Record


Create a new medical record



### POST `/api/v1/medical-records`

**Summary**: Create Medical Record


Create a new medical record



### GET `/api/v1/medical-records/shared`

**Summary**: Get Shared Records


Get shared medical records



### GET `/api/v1/medical-records/shared`

**Summary**: Get Shared Records


Get shared medical records



### GET `/api/v1/medical-records/{record_id}`

**Summary**: Get Medical Record


Get medical record by ID



### GET `/api/v1/medical-records/{record_id}`

**Summary**: Get Medical Record


Get medical record by ID



### POST `/api/v1/medical-records/{record_id}/share`

**Summary**: Share Medical Record


Share medical record



### POST `/api/v1/medical-records/{record_id}/share`

**Summary**: Share Medical Record


Share medical record




## Patient Management

### GET `/api/v1/patients`

**Summary**: Get Patients


Get list of patients



### POST `/api/v1/patients`

**Summary**: Create Patient


Create a new patient



### GET `/api/v1/patients/{patient_id}`

**Summary**: Get Patient


Get patient by ID



### GET `/api/v1/patients/{patient_id}/history`

**Summary**: Get Patient History


Get patient medical history




## Patients

### GET `/api/v1/patients`

**Summary**: Get Patients


Get list of patients



### POST `/api/v1/patients`

**Summary**: Create Patient


Create a new patient



### GET `/api/v1/patients/{patient_id}`

**Summary**: Get Patient


Get patient by ID



### GET `/api/v1/patients/{patient_id}/history`

**Summary**: Get Patient History


Get patient medical history




## Prescriptions

### GET `/api/v1/prescriptions`

**Summary**: Get Prescriptions


Get list of prescriptions



### GET `/api/v1/prescriptions`

**Summary**: Get Prescriptions


Get list of prescriptions



### POST `/api/v1/prescriptions`

**Summary**: Create Prescription


Create a new prescription



### POST `/api/v1/prescriptions`

**Summary**: Create Prescription


Create a new prescription



### PATCH `/api/v1/prescriptions/{prescription_id}`

**Summary**: Update Prescription


Update prescription



### PATCH `/api/v1/prescriptions/{prescription_id}`

**Summary**: Update Prescription


Update prescription



### DELETE `/api/v1/prescriptions/{prescription_id}`

**Summary**: Delete Prescription


Delete prescription



### DELETE `/api/v1/prescriptions/{prescription_id}`

**Summary**: Delete Prescription


Delete prescription



### POST `/api/v1/prescriptions/{prescription_id}/refill`

**Summary**: Refill Prescription


Request prescription refill



### POST `/api/v1/prescriptions/{prescription_id}/refill`

**Summary**: Refill Prescription


Request prescription refill




## Reference Data

### GET `/api/v1/reference/labs`

**Summary**: Get Lab References


Get list of lab reference values



### GET `/api/v1/reference/labs/{lab_id}`

**Summary**: Get Lab Reference


Get lab reference by ID




## System

### GET `/api/v1/`

**Summary**: Root


API root endpoint with welcome information
Clean endpoint: api.bondmcp.com/



### GET `/api/v1/`

**Summary**: Root


API root endpoint with welcome information
Clean endpoint: api.bondmcp.com/



### GET `/api/v1/health`

**Summary**: Health


System health check - shows version, status, and system information
Clean endpoint: api.bondmcp.com/health



### GET `/api/v1/health`

**Summary**: Health


System health check - shows version, status, and system information
Clean endpoint: api.bondmcp.com/health



### GET `/api/v1/ready`

**Summary**: Ready


Readiness probe for load balancers and orchestrators
Clean endpoint: api.bondmcp.com/ready



### GET `/api/v1/ready`

**Summary**: Ready


Readiness probe for load balancers and orchestrators
Clean endpoint: api.bondmcp.com/ready



### GET `/api/v1/status`

**Summary**: Status


Detailed system status with dependency checks
Clean endpoint: api.bondmcp.com/status



### GET `/api/v1/status`

**Summary**: Status


Detailed system status with dependency checks
Clean endpoint: api.bondmcp.com/status



### GET `/api/v1/version`

**Summary**: Version


Version information
Clean endpoint: api.bondmcp.com/version



### GET `/api/v1/version`

**Summary**: Version


Version information
Clean endpoint: api.bondmcp.com/version



### GET `/docs`

**Summary**: Docs Redirect


Redirect to API documentation



### GET `/v2/health`

**Summary**: Comprehensive Health Check


Get comprehensive health status including probes and service info



### GET `/v2/health`

**Summary**: Comprehensive Health Check


Get comprehensive health status including probes and service info



### GET `/v2/health/live`

**Summary**: Liveness Probe


Check if the application is alive and responsive



### GET `/v2/health/live`

**Summary**: Liveness Probe


Check if the application is alive and responsive



### GET `/v2/health/ready`

**Summary**: Readiness Probe


Check if the application is ready to handle requests



### GET `/v2/health/ready`

**Summary**: Readiness Probe


Check if the application is ready to handle requests




## Vendor Integration

### GET `/api/v1/vendors`

**Summary**: Get Vendors


Get list of digital health vendors



### GET `/api/v1/vendors/{vendor_id}`

**Summary**: Get Vendor


Get vendor by ID



### POST `/api/v1/vendors/{vendor_id}/connect`

**Summary**: Connect Vendor


Connect to a vendor




## Vendors

### GET `/api/v1/vendors`

**Summary**: Get Vendors


Get list of digital health vendors



### GET `/api/v1/vendors/{vendor_id}`

**Summary**: Get Vendor


Get vendor by ID



### POST `/api/v1/vendors/{vendor_id}/connect`

**Summary**: Connect Vendor


Connect to a vendor




## Webhooks

### POST `/webhooks/stripe`

**Summary**: Stripe Webhook


Handle Stripe webhook events

Events handled:
- customer.subscription.created
- customer.subscription.updated  
- customer.subscription.deleted
- invoice.payment_succeeded
- invoice.payment_failed
- customer.created


