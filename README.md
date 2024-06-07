# Code Connect

Code Connect is a full-stack application built with Create React App (CRA) for the frontend and a Python backend. The application is containerized using Docker, allowing for easy deployment and scaling.

## System Overview

The frontend of the application is built with React and communicates with the backend through API calls. The backend is built with Python and serves as the API for the frontend, handling data processing and storage.

The application is structured into two main services: `frontend` and `backend`. These services are defined and managed using Docker Compose, which allows for easy management of the application's services.

## Docker Overview

The application uses two Dockerfiles: one for the frontend and one for the backend.

### Frontend Dockerfile

The frontend Dockerfile is based on the official Node.js Docker image. It sets up a working directory, copies the necessary files, installs the dependencies, and builds the application. It then installs the `serve` package globally, which is used to serve the built application. The Dockerfile exposes port 3000 for the application.

### Backend Dockerfile

The backend Dockerfile is based on the official Python Docker image. It sets up a working directory, copies the necessary files, and installs the dependencies. It then runs the necessary Django migrations and exposes port 8000 for the application.

## Docker Compose

The Docker Compose file defines the services, networks, and volumes for the application. It sets up the `frontend`, `backend`, and `nginx` services, each with their own configuration. The `nginx` service acts as a reverse proxy, routing requests to the appropriate service.

## Development

This section provides instructions for setting up the local development environment.

### Backend

The backend server should be running locally for development. It typically runs at `http://localhost:8000`. Detailed instructions for setting up and running the backend server can be found in the backend README.

### Frontend

The frontend makes requests to the backend server. During local development, you need to update the backend API URL in the frontend files. Replace all instances of `backend/*` with `http://localhost:8000/*`.

The frontend of this application is a Create React App (CRA) project. Here are the commands to run the CRA project locally:

1. **Install dependencies**: Navigate to the project directory and run the following command to install the necessary dependencies:

npm install

2. **Start the development server**: Use the following command to start the development server:

npm run dev

This command starts the development server, and you can access the application at `http://localhost:3000` (or another port if 3000 is busy).

3. **Build the application for production**: To create a production build of the application, run:

npm run build

This command creates a `build` directory with a production build of the application.

4. **Run the test suite**: To run the test suite with Jest and React Testing Library, use:

npm test

5. **Eject the application**: If you need to customize the build configuration, you can "eject" from the CRA setup. Note that this is a one-way operation. Once you `eject`, you can’t go back! To eject, run:

npm run eject

Remember to revert the API URLs in the frontend files back to `backend/*` before building the application for production.

## Deployment

When pushing to a new branch, a new version needs to be created in the publish YAML and the Docker Compose file needs to be updated as well.

## Conclusion

Code Connect is a robust, full-stack application that leverages the power of React, Python, and Docker. With a clear separation of frontend and backend concerns and the ease of deployment provided by Docker, Code Connect is built for scalability and ease of use.