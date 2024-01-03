# Cooking Recipes App Backend

Welcome to the backend of the Cooking Recipes App. This guide will help you set up the project locally for development purposes and test GraphQL queries.

## Getting Started

### Prerequisites

-   Node.js (version 12 or higher)
-   npm (usually comes with Node.js)
-   SQLite (for local database setup)

### Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/Oleshkooo/cooking-recipes-app.git
    cd cooking-recipes-app/backend
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

### Running the Server

1. **Start the development server:**

    ```bash
    npm run dev
    ```

    This will start the server on `http://localhost:4000` by default (or on the port you specified in the config file).

## Testing GraphQL Queries

To test GraphQL queries, you can use the built-in GraphQL playground if it's enabled:

1. Navigate to `http://localhost:4000/graphql` in your web browser.
2. You'll see the GraphQL playground where you can write and execute queries.

Alternatively, you can use tools like Postman or Insomnia for testing GraphQL APIs.
