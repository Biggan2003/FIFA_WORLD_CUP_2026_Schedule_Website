# ⚽ FIFA World Cup 2026 Schedule & Fan Zone

[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=Vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-Exclusive_Copyright-red?style=for-the-badge)](#-license)

An ultra-modern, high-performance, and interactive web application designed for football enthusiasts to track the **FIFA World Cup 2026** match schedules, cast live fan votes, and view premium custom match features. Built entirely using an **AI-Native Workflow**, this platform delivers a seamless, responsive, and immersive experience tailored specifically with automated timezone localization.

---

## 🎯 Project Overview & Core Intent

Managing large-scale tournament data dynamically while keeping fans engaged can be challenging. This project bridges that gap by offering a lightweight frontend system that processes dynamic match objects (using TypeScript interfaces) and renders them into specialized, visually striking UI components. It shifts away from boring, traditional tabular grids to structured, card-based interaction flows.

---

## ✨ Extensive Key Features

### 📅 Advanced Timezone Localization (BST Conversion)
* **Seamless Extraction:** The core architecture stores schedule points globally using strict ISO 8601 UTC strings (`YYYY-MM-DDTHH:mm:ssZ`).
* **Dynamic Translation:** Automatically processes and renders native match timings in Bangladesh Standard Time (BST), showing exact date formats, match days, and custom morning/evening identifiers.

### 🗳️ Interactive Live Fan Voting System
* **Real-Time Calculation:** Features an active voting mechanism for each specific match card.
* **Smart UI Feedback:** Tracks user votes instantly, dynamically updating raw data into smooth mathematical percentages (`%`) with instant visual filling bars to highlight the crowd's favorite team.

### 🖼️ Premium Big Frame Layout (Cinematic Banner Component)
* **Minimalist Design:** A dedicated, ultra-clean image frame layout situated at the bottom of the dashboard.
* **Text-Free Aesthetics:** Free of clunky UI headers or text overloads, optimized strictly to display clean, raw, high-resolution group graphics or custom tournament features. Includes dynamic fallback structures via an integrated `onError` handling mechanism.

### 🔍 Dynamic Content Filtering
* **Group Isolation:** Fully integrated filtering modules enabling users to selectively view match data by specific brackets (e.g., *Group C*, *Group A*), reducing on-screen data clutter.

### 🎨 Elite Dark Cyberpunk UI
* **Color Psychology:** Built with a premium matrix of Deep Slates (`bg-slate-950`) and Emerald Greens (`text-emerald-400`), mirroring the premium feel of real football turfs and futuristic stadium scoreboards.

---

## 🛠️ Comprehensive Technical Stack

### Core Frontend Architecture
* **Framework:** `React 18` (Leveraging functional components, hook-driven states, and modern conditional rendering pathways).
* **Language Layer:** `TypeScript` (Strict compile-time type definitions, custom object schemas, and robust parameter safeguarding).
* **Build Architecture:** `Vite` (Ultra-fast Hot Module Replacement (HMR) ensuring instantaneous feedback loops during layout configurations).

### Styling & Utility Libraries
* **CSS Framework:** `Tailwind CSS` (Utility-first framework utilizing hardware-accelerated transitions, custom arbitrary configurations like `h-[450px]`, and adaptive layouts for flawless cross-device performance).
* **Icon Engine:** `Lucide React` (Vector-based, scalable icon tokens optimized for sleek UI layout consistency).

---

## 📂 Advanced Project Architecture

```text
├── public/
│   └── Pictures/              # High-res custom match banners, team images & group cards
├── src/
│   ├── assets/                # Core asset bundles and root utility cascading stylesheets
│   ├── data.ts                # Master schedule datastore handling deep structured match objects
│   ├── types.ts               # Centralized TypeScript interface architectures for object models
│   ├── App.tsx                # Master Application controller containing UI rendering pipelines
│   ├── main.tsx               # High-level React DOM mounting point and root element binding
│   └── index.css              # Tailwind directive injectors alongside custom fluid design variables
├── .env.example               # Template environment mapping sheet for global variables
├── .gitignore                 # Strict Git tracking blocks targeting bulky system caches and build logs
├── package.json               # Manifest file indexing dependencies, project metadata, and core scripts
├── tsconfig.json              # Advanced TypeScript compiler rules and resolution guidelines
└── vite.config.ts             # Custom core configuration parameters for the Vite bundling engine