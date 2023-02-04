# Iftar App Server

This is the server for the Iftar App. It is a simple Node.js server that uses Typescript, Express and MongoDB.

## Getting Started

### Pre-requisites

First, you need to have `docker` and `docker-compose` installed on your machine.
Refer to the [download page](https://docs.docker.com/get-docker/) to get them.

Also you will need `node` and `npm` installed on your machine.
Refer to the [download page](https://nodejs.org/en/download/) to get them.
make sure you install the version specified in the `.nvmrc` file

### Running the project locally

To run the development server, you have two options:

#### 1. Use Docker only (recommended)

This is the recommended way to run the project locally. It will run the project in a container, and you will not need to install any dependencies on your machine.
Docker set up the mongo db for you, and run the server in a locale container.

To run the project in docker, run the following command (this will take a few minutes the first time you run it):

```bash
npm run docker:dev
````

Then open your browser and go to [http://localhost:5000](http://localhost:5000).


#### 2. Use Docker for the backend and run the frontend locally

In case you wanna run the frontend locally, and use docker only for the database, follow those steps:

1 - start the database containers:

```bash
npm run docker:dev:min
````

2 - install the dependencies:

```bash
npm install
````

3 - run the frontend:

```bash
npm run dev
````

Then open your browser and go to [http://localhost:5000](http://localhost:5000).


### Testing the production build locally

To test the production build locally, run the following command:

```bash
npm run docker:prod
````

Then open your browser and go to [http://localhost:5000](http://localhost:5000).

