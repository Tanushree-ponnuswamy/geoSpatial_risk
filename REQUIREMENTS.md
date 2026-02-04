# 🛠️ SYSTEM REQUIREMENTS & DEPENDENCIES

To run the **Nilgiris Geo-Spatial Risk System**, your environment needs the following:

---

## 1. Core Prerequisites
*   **Operating System**: Windows 10/11 (Current), macOS, or Linux.
*   **Runtime**: **Node.js** (Version **18.17.0** or higher is required for Next.js 14).
    *   Download: [nodejs.org](https://nodejs.org/)
*   **Package Manager**: `npm` (comes with Node.js).

---

## 2. Project Dependencies (JavaScript/Node)

The project is divided into two workspaces. Each has its own `package.json`.

### 🌍 Web Portal (`/web`)
*   **Framework**: `next` (v14.1.0+)
*   **UI Library**: `react`, `react-dom` (v18.2.0+)
*   **Development**: `eslint` (Code quality)

### 🏛️ Admin Portal (`/admin`)
*   **Framework**: `next` (v14.1.0+)
*   **UI Library**: `react`, `react-dom` (v18.2.0+)

---

## 3. Future AI Engine Dependencies (Python)
*Note: The current version uses a simulated logic. Phase 2 (Data Science) will require:*

*   **Python**: 3.9+
*   **Packages**:
    *   `fastapi` (API Server)
    *   `uvicorn` (ASGI Server)
    *   `geopandas` (Vector Data)
    *   `rasterio` (Raster/Heatmaps)
    *   `scikit-learn` (Risk Prediction)
    *   `shapely` (Geometry checks)

---

## 4. Hardware Requirements
*   **RAM**: Minimum 4GB (8GB Recommended for running both servers + map rendering).
*   **Storage**: 500MB for source code & node_modules.
*   **Network**: Internet connection required for initial package install.

---

## 📥 QUICK INSTALLATION (Windows)

If you have Node.js installed, simply run this in the root folder:

```powershell
npm install
```
*(Note: You need to run `npm install` inside BOTH `web` and `admin` folders separately.)*
