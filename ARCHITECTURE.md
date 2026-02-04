# Geo-Spatial Risk–Based Building Approval System (Nilgiris)

## ✅ COMPLETE PROCESS FLOW

### 🔒 PHASE 0: SYSTEM SETUP (ONE-TIME)
Before users even come in, the system already has:
* **Nilgiris boundary fixed**
* **GIS layers loaded:**
  * Cadastral parcels (survey numbers)
  * Soil maps
  * Slope (DEM)
  * Streams & drainage
  * Forest & ESZ
  * Landslide / hazard history
* **Rule base configured:**
  * Local body building rules
  * Forest Act / ESZ norms
  * Hill area conservation rules
  * Fire & safety norms

> 📌 These are **not AI decisions** — these are **authoritative inputs**.

---

### 👤 PHASE 1: USER PROCESS (CITIZEN / ARCHITECT)

#### STEP 1: User Login & Proposal Creation
* User logs in
* Creates **New Building Proposal**
* System locks scope to **Nilgiris**

#### STEP 2: Land Identification (PARCEL-LEVEL)
**User inputs:**
* Survey / Plot Number
* Village + Taluk

**System does (GIS):**
* Fetches **entire land parcel polygon**
* Plots full boundary on map
* Computes exact area (sq ft)

> 📌 User **cannot edit** parcel shape
> 📌 If parcel not found → assisted polygon drawing

#### STEP 3: Building Proposal Submission
User submits:
* Intended use (Residential / Commercial)
* No. of floors (2–3 storeys)
* Approx built-up area
* Uploads:
  * Building plan (PDF / CAD)
  * Site photos (optional)

> 📌 No ownership documents required at this stage.

#### STEP 4: User Submits Proposal
* User clicks **Submit**
* Proposal becomes **read-only**
* Project ID generated

➡️ Control now moves fully to the system.

---

### ⚙️ PHASE 2: SYSTEM INTELLIGENCE PROCESS (AUTOMATIC)

#### STEP 5: Parcel Geometry Validation (RULE-BASED)
System validates:
* Polygon integrity
* Area sanity check
* Within Nilgiris boundary

❌ If invalid → returned to user
✅ If valid → proceed

#### STEP 6: Geo-Spatial Analysis (NO AI, PURE GIS)
Using **geofencing on the full parcel**, system computes:
* Soil type(s) within land
* Max / avg slope
* Streams crossing or near land
* Distance to water bodies
* Forest / ESZ overlap
* Landslide-prone zones
* Historical hazard events nearby

> 📌 Worst-case sub-area governs risk.

#### STEP 7: Heat Map Generation
System generates **visual layers**:
* Slope heat map
* Landslide susceptibility
* Drainage density
* Ecosystem sensitivity

These maps are:
* Stored with the proposal
* Visible only to authorities

#### STEP 8: Risk Scoring (**ML USED HERE**)
**Inputs to ML model:**
* Geo-spatial parameters
* Land sensitivity indicators
* Building characteristics
* Historical incidents

**ML Output:**
* Risk Score (0–100)
* Risk Category:
  * Low
  * Medium
  * High
  * Very High

> 📌 ML **predicts risk**, not legality.

#### STEP 9: Rule & Norm Evaluation (**RULE ENGINE**)
System checks:
* Applicable acts & norms
* Construction permissibility
* Mandatory restrictions

Outputs:
* Allowed / Conditional / Prohibited
* Mandatory department approvals

> 📌 No LLM decides rules.

#### STEP 10: Authority Mapping (RULE-BASED)
Based on:
* Risk level
* Land category
* Overlapping zones

System automatically maps to:
* Local body
* Forest department
* Geology department
* Fire department (if required)

> 📌 User does not select authorities.

#### STEP 11: Insight Generation (**LLM USED HERE**)
LLM generates:
* Plain-language explanation of risk
* Authority-specific summaries:
  * What matters for Forest
  * What matters for Geology
  * What matters for Fire safety

> 📌 LLM explains — it does NOT approve.

---

### 🏛️ PHASE 3: ADMIN / AUTHORITY PROCESS

#### STEP 12: Authority Login
Each authority sees:
* Only proposals assigned to them
* No irrelevant personal data

#### STEP 13: Authority Map & Data View
Authority dashboard shows:
* Entire parcel boundary
* Heat maps
* Highlighted overlap zones
* Extracted land & building parameters

This answers:
> “What is risky in this land for MY department?”

#### STEP 14: Document Review
Authorities can view:
* Building plans
* Site photos
* System-extracted parameters

> 📌 Sensitive data masked
> 📌 All access logged

#### STEP 15: AI-Assisted Decision Support (**LLM**)
System provides:
* Risk reasoning
* Suggested inspection focus
* Applicable rules summary

> 📌 Human officer makes the decision.

#### STEP 16: Authority Decision
Authority chooses:
* Approve
* Reject
* Approve with conditions
* Request clarification

Decision is:
* Digitally signed
* Time-stamped
* Audit-logged

---

### 📢 PHASE 4: FINALIZATION & NOTIFICATION

#### STEP 17: Consolidation of Decisions
System checks:
* All mandatory authorities responded

If all approved → **Final Approval Issued**
If any rejected → **Proposal Closed with Reasons**

#### STEP 18: User Notification
User receives:
* Final status
* Reasons / conditions
* Downloadable approval (if approved)

---

### 🧠 WHERE EACH TECHNOLOGY IS USED (FINAL CLARITY)

| Part | Technology |
| :--- | :--- |
| Parcel plotting | GIS |
| Geofencing | Spatial rules |
| Soil / slope | GIS data |
| Heat maps | GIS |
| Risk score | **ML** |
| Legal checks | Rule engine |
| Authority mapping | Rules |
| Explanation & summaries | **LLM** |
| Workflow coordination | Services / optional agents |
| Approval | Human |

---

### 🟢 FINAL TAKEAWAY

* ✔ Deterministic where law is involved
* ✔ ML only where prediction is needed
* ✔ LLM only where explanation helps
* ✔ Humans retain final authority
* ✔ Fully suitable for Nilgiris
