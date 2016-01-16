# iAdvize VDM back-end test

This is an application built with Node, Express and PostgreSQL.

## Quick Start

1. Clone the repo
2. Install dependencies: `$ npm install`
3. Start your Postgres server and create a database called `iadvize_db`
4. Create the database tables: `$ node lib/database`
5. Start the server: `$ npm start`

## Get VDM posts

1. Install PhantomJS. `$ npm install -g phantomjs` or `$ brew install phantomjs`
2. We will first need to run server: `$ npm start`
3. Get the last 200 posts, run in another terminal `$ phantomjs lib/getLastVDM.js`

## API Usage
- Get the last 200 VDMs via `api/posts`
- Or search by:
  + Author `?author=Anonyme`
  + Date from `?from=YYYY-MM-DD`
  + Date to `?to=YYYY-MM-DD`
- Get one VDM by id via `api/posts/:id`

## Unit testing

1. Create a new database called `idavize_db_test`
2. Create the database tables: `$ node lib/database --test`
3. We will first need to run server: `$ npm start -- --test`
4. Run in another terminal `$ npm test`

## Custom PostgreSQL config

Edit the file `config.js` and set your own connection informations

## Regrets
- Don't get and store IDs VDM posts : relaunch getLastVDM script add same posts.
- POST last 200 VDMs on API instead of saving in database directly from getLastVDM script, because of PhantomJS uses.

<p align="center">
<img src="./gifs/done.gif" width="50%" />
</p>
