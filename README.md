# GTFS Scheduler Viewer

GTFS Scheduler Viewer is an Angular web application for viewing the content of a
GTFS feed on a map. This application exposes the GTFS content through a RESTFUL API
service which is consumed by the angular web app. Since this is just an example
The server application is just reading a mock feed (from the local directory).

![Web Application](app.png?raw=true 'Web Application')

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

This project requires the following modules/libraries:

```
- Nodejs 8.9.x or higher version
- npm 5.8.x or higher version
```

### Installing

To set up the project we need to install the dependencies for each project. This is because we are treating each service as a separate instance.
Run the following commands from the command prompt in the root directory:

```
npm install
cd client
npm install
cd ..
```

## Usage

To start the project run the following commands:

    npm run dev

this will start the project in development mode.
After the project started you can use the following endpoints:

| Method | Endpoint              | Description             |
| ------ | --------------------- | ----------------------- |
| GET    | http://localhost:4200 | Open the client web app |

## Built With

- [Angular](http://angular.io) - The web framework used
- [npm](https://www.npmjs.com) - Dependency Management

## Authors

- **Max Medina** - [maxmedina05](https://github.com/maxmedina05)

## License

This project is unlicensed.

## Acknowledgments

- Hat tip to anyone whose code was used
- Inspiration
- etc
