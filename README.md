# Next Redux Itinary

_An itinary app with dragging inputs reorder & optimize itinary features._

This project is built with :

* Next.js (see [here](https://github.com/zeit/next.js/) for the relative documentation).
* Koa
* React
* React-google-maps
* Redux
* Redux-form
* React-motion
* Redux-saga
* Reselect
* Seamless-immutable
* Rebass
* Eslint & prettier
* Enzyme & Jest
* Husky

## Demo

You can see the live demo of the itinary app on [Heroku](https://next-redux-itinary.herokuapp.com/).

You can customize the itinary by filling the form, or by adding Google place ids to the url with the following format:

```
?addresses=ChIJN7ithv1x5kcRBEKOU44bvMk,ChIJ3e-
uwuFv5kcRamCUXhoPOhI,ChIJd8y5Qzlu5kcRijTUmkvheew,ChIJ270fenJu5kcRV2qNT7_VbF0
```

**Warning :** the results in the form are limited to France (but not in the query string).

## Installation

* Clone this repo
* Run `npm install`
* The project uses dotenv for handling environment variables. Rename `.env.sample` to `.env` and replace the GOOGLE_API_KEY with your own.
* Once dependencies installed, run `npm start` (production) or `npm run dev` (development)
* Open your browser at `http://localhost:3000`

## Run tests

Just run : `npm run test`

## Connect to postgres (psql):

```
docker run -it --rm  --network nextreduxitinary_default --name pg postgres psql -h postgres-db -p 5432 -U postgres postgres
```
### Create your database `itinary`
```
CREATE DATABASE itinary;
```
### Connect to it
```
\connect itinary
```
The postgres instance should be accessible inside the itinary app with its container address:
```
# PostgresSQL
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
POSTGRES_URL=postgres-db
POSTGRES_DB=itinary

```

## Ways to improve

* End unit testing
* Add end to end testing
* Improve responsive
* Improve UX on draggable inputs

## Troubleshooting

* The postgres db being in the root folder of the app being build, you may have to chmod the `postgres-db` folder to prevent the docker build from failing

  `sudo chown 999:$USER -R postgres-db`
