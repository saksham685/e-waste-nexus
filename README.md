# E-WASTE NEXUS
### AI-Powered Circular Logistics & Extended Producer Responsibility (EPR) Credit Management Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/Node.js-v20%2B-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-cyan.svg)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-3D_WebGL-lime.svg)](https://threejs.org/)
[![WEEE Compliance](https://img.shields.io/badge/WEEE_Directive-ISO_14001-brightgreen.svg)](https://www.epa.gov/)

**E-Waste Nexus** is a production-grade, enterprise-ready digital platform bridging the gap between individuals, businesses, certified collection partners, specialized metallurgical recyclers, and corporate producers. It automates end-to-end chain of custody, physical scale verification, and cryptographic Extended Producer Responsibility (EPR) credit management.

---

## 🌟 Key Features

1. **Immersive 3D Circular Earth & Telemetry**
   - Interactive Three.js WebGL globe featuring illuminated recycling transfer routes, orbiting microchips, and ambient environmental stardust.
   - Live-style telemetry panel with EPA lifecycle modeled metrics (avoided CO₂e, heavy metals diverted, groundwater preserved).

2. **Smart Doorstep E-Waste Collection**
   - Category-specific intake (Smartphones, Laptops, Batteries, Displays, Office gear, Large appliances).
   - Dynamic scheduling with calendar date picker, time windows, and handling instructions.
   - Visual chain-of-custody tracking timeline: `Requested → Approved → Assigned → Collected → Weighed → Sent for Recycling → Completed`.

3. **Collection Partner Fleet Portal**
   - Real-time dispatch manifest with authorized customer contact details.
   - Calibrated scale weight logging with mandatory photo/receipt upload.
   - Strict unverified weight governance: Collected weights remain unverified until audited by QA.

4. **Certified Recycler Refining Hub**
   - Intake and pyrometallurgical assay logging.
   - Separation of received weight vs. refined secondary commodity yield.
   - 1-Click EPR credit claim generation for certified batches.

5. **Flagship EPR Credit Management Module**
   - Multi-tier conversion matrix (e.g. 2.0x for high cobalt/lithium batteries, 1.8x for smartphones, 1.2x for computers).
   - Strict anti-duplicate protections preventing double-spending or duplicate issuance.
   - Executive CSV export for regulatory compliance audits.

6. **Administrator Control Center**
   - System overview telemetry and user role governance.
   - Dedicated physical weight verification queue.
   - Immutable audit logs capturing actor, action, previous values, updated values, and timestamps.

---

## 👥 Evaluation & Demo Personas

For hackathon grading and live presentations, use the navbar's **Demo Persona Switcher** or log in directly with these pre-seeded accounts:

| Persona | Role | Email | Password |
|---|---|---|---|
| **Dr. Evelyn Vance** | Global Administrator | `admin@nexus.eco` | `Admin@123` |
| **Marcus Sterling** | Logistics Fleet Partner | `partner@nexus.eco` | `Partner@123` |
| **Elena Rostova** | Certified Recycler | `recycler@nexus.eco` | `Recycler@123` |
| **Sarah Jenkins** | Individual Consumer | `user@nexus.eco` | `User@123` |

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18 or higher recommended; tested on v24)
- npm (v9 or higher)

### Installation
From the root directory (`c:\ewaste`):

```bash
# 1. Install all dependencies across client and server
npm run install:all

# 2. Run automated test suite
npm test

# 3. (Optional) Force re-seed database with realistic enterprise records
npm run seed

# 4. Launch both Backend API (Port 5000) and Frontend Client (Port 5173)
npm run dev
```

Visit: **http://localhost:5173**

---

## 🧪 Automated Testing

Run the included verification test suite:

```bash
npm test
```

Tests verify:
- Bcrypt password hashing & JWT token validation
- Pickup state machine transitions & role barriers
- Unverified scale weight governance & QA adjustments
- Recycler separation yield validation
- EPR credit calculation formula accuracy
- Anti-duplicate fraud prevention for identical recycling runs

---

## 📊 EPR Credit Multiplier Matrix

Calculated per kilogram of verified processed material:

| Waste Category | Multiplier Factor | Regulatory Rationale |
|---|---|---|
| **Batteries and Chargers** | `2.0 credits / kg` | High cobalt, lithium, and nickel resource recovery |
| **Smartphones and Tablets** | `1.8 credits / kg` | High gold, palladium, and rare-earth density |
| **Laptops and Computers** | `1.2 credits / kg` | Multi-layer PCBs, copper heat pipes, aluminum |
| **Televisions and Monitors** | `1.0 credits / kg` | Glass, indium tin oxide, structural polymers |
| **Printers and Office** | `0.8 credits / kg` | Electromechanical assemblies & toner housings |
| **Large Appliances** | `0.5 credits / kg` | Structural ferrous metals & compressors |
| **Other Electronic Waste** | `0.5 credits / kg` | Base electrical circuitry |

---

## 📡 REST API Endpoints

### Authentication
- `POST /api/auth/register` - Create new role-based account
- `POST /api/auth/login` - Authenticate & obtain JWT
- `GET /api/auth/me` - Fetch authenticated user profile
- `POST /api/auth/logout` - Invalidate session

### Pickups
- `POST /api/pickups` - Submit new pickup request
- `GET /api/pickups` - List pickups (role-scoped)
- `GET /api/pickups/:id` - Get pickup details with chain-of-custody records
- `PATCH /api/pickups/:id/status` - Transition status (enforces lifecycle barriers)
- `POST /api/pickups/:id/cancel` - Cancel pending pickup

### Collections
- `POST /api/collections` - Partner logs scale weight & photo evidence (marked unverified)
- `GET /api/collections` - List collection records
- `PATCH /api/collections/:id/verify` - Administrator certifies net weight

### Recycling & EPR
- `POST /api/recycling` - Log recycler batch & assay yield
- `GET /api/recycling` - List recycler intake runs
- `POST /api/epr/records` - Claim EPR credits for certified batch
- `GET /api/epr/records` - List EPR credit records with status filters
- `PATCH /api/epr/records/:id/approve` - Admin compliance approval
- `GET /api/epr/reports/csv` - Download CSV compliance audit report

### Governance & Analytics
- `GET /api/admin/overview` - Platform KPIs & review queues
- `GET /api/admin/users` - User management table
- `PATCH /api/admin/users/:id/status` - Suspend or activate accounts
- `GET /api/admin/audit-logs` - Cryptographic system audit logs
- `GET /api/centers` - Collection center discovery directory
- `GET /api/analytics` - Lifecycle telemetry & emission avoidance models

---

## 🛡️ Architecture & Security
- **Data Persistence**: Universal DB layer with automated JSON persistence (`server/data/db.json`) and zero external dependency setup; compatible with standard MongoDB URIs.
- **Security**: Passwords salted & hashed with bcryptjs; JWT bearer tokens; role-based access control (RBAC) middleware on all sensitive endpoints; file uploads validated by MIME & extension.
- **Auditing**: Every critical write operation generates an immutable `AuditLog` entry tracking actor ID, role, action, previous values, and updated values.
