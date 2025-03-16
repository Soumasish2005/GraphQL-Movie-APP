# GraphQL Movie App

This is a GraphQL-based Movie Application that allows users to manage and query information about movies and anime movies. The application is built using Node.js, Express, Apollo Server, and PostgreSQL.

## Features

- User management (create, update, delete users)
- Movie management (query movies, filter movies by rating)
- Anime movie management (query anime movies, filter anime movies by various criteria)
- Secure database connection using SSL

## Project Structure

```
.
├── client
│   └── .gitignore
├── server
│   ├── db
│   │   ├── certs
│   │   │   └── ca.pem
│   │   └── connection.js
│   ├── data
│   │   └── test-data.js
│   ├── schema
│   │   ├── resolvers.js
│   │   └── typeDefs.js
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── server.js
└── README.md
```

## Getting Started

### Prerequisites

- Node.js
- PostgreSQL

### Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/your-username/ai-movie-app.git
    cd ai-movie-app
    ```

2. Install server dependencies:
    ```sh
    cd server
    npm install
    ```

3. Set up environment variables:
    Create a `.env` file in the `server` directory and add the following:
    ```
    PORT=4000
    DB_USER=your_db_user
    DB_PASSWORD=your_db_password
    DB_HOST=your_db_host
    DB_PORT=your_db_port
    DB_DATABASE=your_db_name
    DB_SSL_CA_PATH=../db/certs/ca.pem
    ```

4. Start the server:
    ```sh
    npm run dev
    ```

### Usage

- Access the GraphQL playground at `http://localhost:4000/graphql`
- Use the provided queries and mutations to interact with the application

## Available Scripts

- `npm run dev`: Start the server in development mode

## Technologies Used

- Node.js
- Express
- Apollo Server
- GraphQL
- PostgreSQL
- dotenv
- cors
- body-parser

## License

This project is licensed under the MIT License.

## Author

Soumasish Dasgupta
