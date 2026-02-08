# Bazaar Scan MVP

A modern web application for scanning and comparing bazaar prices.

## Quick Start

The easiest way to run the application is to use the server, which serves the built frontend.

1.  **Install Dependencies** (if not already done):
    ```bash
    cd server && npm install
    cd ../client && npm install
    ```

2.  **Build Frontend**:
    ```bash
    cd client && npm run build
    ```

3.  **Start Server**:
    ```bash
    cd server && npm run dev
    ```

4.  **Open App**:
    Visit [http://localhost:3000](http://localhost:3000)

## Development

For active development with hot-reloading:

1.  **Start Backend** (Terminal 1):
    ```bash
    cd server && npm run dev
    ```

2.  **Start Frontend** (Terminal 2):
    ```bash
    cd client && npm run dev
    ```
    Access the frontend at [http://localhost:5173](http://localhost:5173) (or whatever port Vite asserts).

## Features

- **Vendor Portal**: Register shops, manage products and prices.
- **Product Search**: Find products in nearby shops with distance sorting.
- **Statistics**: View market price trends.
- **Live Maps**: Interactive map of shops and products.

## Tech Stack

- **Frontend**: React, Vite, TailwindCSS, Leaflet
- **Backend**: Node.js, Express, Prisma, PostgreSQL
