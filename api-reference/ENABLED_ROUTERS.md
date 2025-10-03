# BondMCP Platform - Enabled Routers Documentation

**Phase 2.3: Router Activation**  
**Date:** September 30, 2025  
**Status:** In Progress

## Overview

This document tracks the activation of routers from the `app/api/` directory into the main application.

## Current State (Before Phase 2.3)

### Routers Enabled in main.py:
1. **MCP Router** (`/mcp`) - MCP protocol endpoints
2. **Health Router V2** (`/v2`) - Advanced health endpoints

### Total Endpoints Before: ~20

## Available Routers in app/api/

| Router File | Status | Prefix | Dependencies | Notes |
|------------|--------|--------|--------------|-------|
| admin.py | ✅ Ready | /admin | None | Mock admin endpoints |
| api_keys.py | ✅ Ready | /api-keys | Stripe, Auth | Requires subscription |
| appointments.py | ✅ Ready | /appointments | None | Mock appointment mgmt |
| billing.py | ✅ Ready | /billing | Stripe, Auth | Payment processing |
| digital_programs.py | ✅ Ready | /digital-programs | None | Digital health programs |
| lab_reference.py | ✅ Ready | /reference | None | Lab reference values |
| medical_records.py | ✅ Ready | /medical-records | None | Record management |
| patients.py | ✅ Ready | /patients | None | Patient CRUD |
| prescriptions.py | ✅ Ready | /prescriptions | None | Rx management |
| system.py | ✅ Ready | /system | None | System health & status |
| vendors.py | ✅ Ready | /vendors | None | Vendor integrations |
| auth.py | ⚠️ Review | /auth | Database | May conflict with main.py auth |
| health.py | ⚠️ Review | /health | AI Service | May conflict with main.py |
| health_simple.py | ⚠️ Review | /health-simple | None | Simple health endpoints |
| auth_broken.py | ❌ Skip | - | - | Marked as broken |

## Router Readiness Assessment

### ✅ Safe to Enable (11 routers)

These routers have no external dependencies or conflicts:

1. **admin.py** - Admin dashboard endpoints
   - Endpoints: 3
   - Auth: Required
   - Dependencies: None

2. **api_keys.py** - API key management
   - Endpoints: 4
   - Auth: Required
   - Dependencies: Stripe (optional), get_current_user

3. **appointments.py** - Appointment scheduling
   - Endpoints: 6
   - Auth: Should add
   - Dependencies: None

4. **billing.py** - Stripe billing integration
   - Endpoints: 7
   - Auth: Required
   - Dependencies: Stripe API, get_current_user

5. **digital_programs.py** - Digital health programs
   - Endpoints: 3
   - Auth: Should add
   - Dependencies: None

6. **lab_reference.py** - Lab reference data
   - Endpoints: 2
   - Auth: Optional
   - Dependencies: None

7. **medical_records.py** - Medical record CRUD
   - Endpoints: 5
   - Auth: Required
   - Dependencies: None

8. **patients.py** - Patient management
   - Endpoints: 4
   - Auth: Required
   - Dependencies: None

9. **prescriptions.py** - Prescription management
   - Endpoints: 5
   - Auth: Required
   - Dependencies: None

10. **system.py** - System health & monitoring
    - Endpoints: 2+
    - Auth: Not required
    - Dependencies: None

11. **vendors.py** - Vendor integration
    - Endpoints: 3
    - Auth: Should add
    - Dependencies: None

### ⚠️ Needs Review (3 routers)

1. **auth.py** - May have advanced auth features that conflict with main.py
2. **health.py** - May overlap with existing /health endpoints in main.py
3. **health_simple.py** - May overlap with existing health endpoints

### ❌ Skip (1 router)

1. **auth_broken.py** - Explicitly marked as broken

## Activation Plan

### Phase 1: Enable Core Business Logic (Priority 1)
- ✅ billing.py
- ✅ api_keys.py
- ✅ patients.py
- ✅ prescriptions.py
- ✅ medical_records.py
- ✅ appointments.py

### Phase 2: Enable Supporting Features (Priority 2)
- ✅ admin.py
- ✅ system.py
- ✅ digital_programs.py
- ✅ lab_reference.py
- ✅ vendors.py

### Phase 3: Review and Resolve Conflicts (Priority 3)
- ⚠️ auth.py - Check for unique endpoints
- ⚠️ health.py - Check for conflicts
- ⚠️ health_simple.py - Check for conflicts

## Endpoint Count Projection

- **Before:** ~20 endpoints
- **After Phase 1:** ~50 endpoints
- **After Phase 2:** ~67+ endpoints
- **After Phase 3:** ~75+ endpoints (if no conflicts)

## Implementation Steps

1. ✅ Audit all routers
2. ⏳ Import and enable safe routers
3. ⏳ Add authentication where missing
4. ⏳ Test all endpoints
5. ⏳ Update MCP configuration
6. ⏳ Generate integration tests
7. ⏳ Update API documentation

## Testing Strategy

For each enabled router:
1. Verify endpoint accessibility
2. Test authentication/authorization
3. Validate response schemas
4. Check error handling
5. Confirm no conflicts with existing endpoints

## Next Steps

1. Enable Phase 1 routers (core business logic)
2. Run integration tests
3. Update MCP configuration
4. Enable Phase 2 routers
5. Review Phase 3 routers for conflicts
6. Final testing and documentation update

---

*Last Updated: September 30, 2025*
