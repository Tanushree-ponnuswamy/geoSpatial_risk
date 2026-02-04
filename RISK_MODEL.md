# 📐 RISK SCORING MODEL (DRAFT)

This document defines the logic for the **Machine Learning Risk Scoring Model (Step 8)**.
The model is **Deterministic + Probabilistic**: It uses hard weights for critical factors (Physics) and probabilistic adjustments for historical data.

---

## 1. CORE FORMULA

$$
\text{Total Risk Score} (R) = (W_S \times S) + (W_G \times G) + (W_H \times H) + (W_E \times E)
$$

Where:
* **S** = Slope Factor (Topography)
* **G** = Geological Stability (Soil/Rock)
* **H** = Hydrological Risk (Water flow)
* **E** = Environmental Sensitivity (Forest/Distance)
* **W** = Weights determining importance

**Range:** 0 (Safe) to 100 (Extremely Hazardous)

---

## 2. PARAMETER BREAKDOWN

### A. Slope Factor (S) - Max Weight: 40%
Nilgiris is hilly; slope is the primary danger.
* **< 10°**: Score 0 (Flat/Gentle)
* **10° - 20°**: Score 30 (Moderate)
* **20° - 30°**: Score 60 (Steep)
* **> 30°**: Score 100 (Critical - Construction usually banned)

### B. Geological Stability (G) - Max Weight: 25%
Based on Soil Maps and Landslide History.
* **Stable Rock**: Score 10
* **Loose Soil / Clay**: Score 50
* **History of Slide (1km radius)**: Score +20 penalty
* **Previous Landslide on Parcel**: Score 100 (Prohibited)

### C. Hydrological Risk (H) - Max Weight: 20%
Proximity to streams and natural drainage paths.
* **> 50m from stream**: Score 0
* **20m - 50m**: Score 40
* **< 15m**: Score 90 (High Risk)
* **On Natural Drain**: Score 100 (Blockage risk)

### D. Environmental Sensitivity (E) - Max Weight: 15%
Proximity to Reserved Forest (RF) or Ecologically Sensitive Zones (ESZ).
* **Urban Zone**: Score 0
* **Buffer Zone**: Score 50
* **Inside ESZ**: Score 100

---

## 3. ML ADJUSTMENT LAYER (The "Smart" Part)

While the base score is calculated as above, the ML model adjusts the final score based on **pattern matching** from historical incidents.

$$
R_{Final} = R_{Base} \times (1 + \alpha)
$$

Where $\alpha$ (Alpha) is the **History Multiplier**.
* If similar slopes/soils in the past 10 years caused landslides $\rightarrow$ $\alpha$ becomes positive (e.g., +0.2).
* Example: A 25° slope might normally be "Medium Risk", but if 5 houses on 25° slopes collapsed last monsoon, the ML boosts it to "High Risk".

---

## 4. RISK CATEGORIES (OUTPUT)

| Score | Category | Implication |
| :--- | :--- | :--- |
| **0 - 25** | 🟢 **Low** | Standard Approval Process. |
| **26 - 50** | 🟡 **Medium** | Additional Structural checks required. |
| **51 - 75** | 🟠 **High** | Mandatory Geology & Soil Tests. Strict scrutiny. |
| **76 - 100** | 🔴 **Very High** | **Auto-Flagged for Rejection**. exceptional clearance needed. |

---

## 5. AUTHORITY ROUTING
* **Low**: Local Municipality only.
* **Medium**: + Junior Engineer Site Inspection.
* **High**: + District Geologist + Forest Dept.
* **Very High**: + District Collector / Hill Area Conservation Authority (HACA).
