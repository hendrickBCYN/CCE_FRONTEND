# CCE Frontend — EHPAD Room Configurator

React web application serving as the interface for the **EHPAD Room Configurator (CCE)**, a tool for configuring medical facility rooms with Unity WebGL 3D visualization and PDF floor plan generation.

**CDA Context**: this project serves as the foundation for the *Concepteur Développeur d'Applications* professional certification (RNCP Level 6).


## Tech Stack

Framework: React 19.x 
Bundler: Vite 7.x 
Routing: react-router-dom 7.x
Google Auth: @react-oauth/google 0.13.x
HTTP Client: Axios 1.13.x
3D Integration: react-unity-webgl 10.1.x
Linting: ESLint 9.x


## Prerequisites

- **Node.js** ≥ 20
- **npm** ≥ 9
- A **Google OAuth 2.0 Client ID** (Google Cloud Console → APIs & Services → Credentials)
- The **CCE backend** (`cce-backend`) running on port 3000
- A **Unity WebGL build** placed in `public/unity-build/Build/` 


## Installation

```bash
# Clone the repository
git clone https://github.com/hendrickBCYN/CCE_FRONTEND.git
cd CCE_FRONTEND

# Install dependencies
npm install

# Set up environment variables
cp env.example .env
# Fill in VITE_GOOGLE_CLIENT_ID and VITE_API_URL in .env
```


## Environment Variables

`VITE_GOOGLE_CLIENT_ID`: Google OAuth 2.0 Client ID *(required)* 
`VITE_API_URL`: Express backend API URL `http://localhost:3000/api` 


## Available Scripts

```bash
npm run dev       # Start the Vite dev server (port 5173)
npm run build     # Build for production
npm run preview   # Preview the production build
npm run lint      # Run ESLint
```


## Project Structure

```
src/
├── assets/                         # Static assets (BYCN logo, etc.)
├── components/
│   ├── auth/
│   │   ├── LoginPage.jsx           # Google SSO login page
│   │   └── LoginPage.css
│   ├── configurator/
│   │   ├── ConfiguratorPage.jsx    # Main page — Unity WebGL container
│   │   └── ConfiguratorPage.css
│   ├── common/
│   │   └── LoadingScreen.jsx       # Reusable loading screen
│   └── layout/
│       ├── Header.jsx              # Navigation bar (user info + logout)
│       ├── Header.css
│       └── ProtectedRoute.jsx      # Authentication guard (HOC)
├── context/
│   ├── AuthContext.js              # React context creation
│   └── AuthProvider.jsx            # Provider: auth state, login, logout
├── hooks/
│   ├── useAuth.js                  # Hook to access the auth context
│   └── useUnity.js                 # Hook managing the Unity WebGL lifecycle
├── services/
│   ├── api.js                      # Axios instance (JWT interceptors + 401 redirect)
│   └── authService.js              # Auth API calls (login, verify)
├── App.jsx                         # Root component (providers + routing)
└── main.jsx                        # React entry point
```


## Authentication Flow

1. The user lands on `/login` and clicks **Sign in with Google**
2. Google displays the consent popup and returns a `credential` (Google JWT)
3. The frontend sends this credential to the backend (`POST /api/auth/google`)
4. The backend verifies it with Google, creates or retrieves the user in the database, and returns an **application JWT** along with user info
5. The JWT is stored in `localStorage` (`cce_token`) and automatically injected by the Axios request interceptor
6. The user is redirected to `/configurator` (protected by `ProtectedRoute`)

On page reload, `AuthProvider` verifies the token validity via `GET /api/auth/verify`.


## React ↔ Unity Communication

The `useUnity` hook orchestrates the bidirectional bridge between React and Unity WebGL:

**React → Unity** (via `sendMessage`):
- `ReceiveAuthToken`: passes the JWT to the Unity `NetworkManager`
- `ReceiveUserInfo`: passes the user's email and display name

**Unity → React** (via `ReactBridge.jslib` + events):
- `SendSaveRequest`: Unity requests a configuration save
- `SendLoadRequest`: Unity requests a configuration load
- `SendPdfGenerated`: Unity sends a generated PDF as base64

Unity WebGL builds must be placed in `public/unity-build/Build/` with the `Builds` prefix and `.unityweb` extension.


## Development Proxy

In `dev` mode, Vite automatically proxies `/api` requests to the Express backend (`http://localhost:3000`) as configured in `vite.config.js`.


## Planned Improvements

- **Configuration management UI**: list, select, and delete saved configurations.
- **Docker containerization**: Dockerfile + docker-compose for deployment.
- **Auth mock removal**: full wiring to the Google OAuth 2.0 backend + JWT verification


## Related Project

- **Backend**: [`CCE_BACKEND`](https://github.com/hendrickBCYN/CCE_BACKEND) — Node.js/Express API, MySQL 8.0, Sequelize ORM
