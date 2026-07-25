# Capstone1

A full-stack capstone application built with the MERN stack (MongoDB, Express, React, Node.js). This repository separates the web client and API server so each layer can be developed, tested, and deployed independently.

## Tech stack

| Layer    | Technology                          |
| -------- | ----------------------------------- |
| Frontend | React (functional components, hooks) |
| Backend  | Node.js, Express (REST API)         |
| Database | MongoDB (Mongoose)                |

## Project structure

The codebase is organized around a typical MERN layout. Folders will appear as features are added:

```text
capstone1/
├── client/          # React frontend (Vite or CRA)
├── server/          # Express API, routes, middleware
│   ├── models/      # Mongoose schemas
│   ├── routes/
│   └── ...
├── .env.example     # Documented environment variables (no secrets)
└── README.md
```

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- [MongoDB](https://www.mongodb.com/) locally or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Git

### Installation

1. Clone the repository and enter the project directory:

   ```bash
   git clone https://github.com/hydro1d/capstone1.git
   cd capstone1
   ```

2. Copy environment templates when `server/.env.example` (and client env files) are added, then set your values locally. Do not commit `.env` files.

3. Install dependencies and run the app once `client/` and `server/` packages exist:

   ```bash
   # Server (from server/)
   npm install
   npm run dev

   # Client (from client/, separate terminal)
   npm install
   npm run dev
   ```

Exact scripts and ports will be documented here when the initial scaffold is committed.

## License

This project is licensed under the MIT License — see [LICENSE](LICENSE).
