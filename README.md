# iAdvize VDM back-end test

This is an application built with Node, Express and PostgreSQL.

## Get VDM articles

1. Run `$ brew install phantomjs`
2. Get the last 200 articles `$ phantomjs getLastVDM.js`

## Quick Start

1. Clone the repo
2. Install dependencies: `npm install`
3. Start your Postgres server and create a database called "iadvize_db"
4. Create the database tables: `node database.js`

## Custom PostgreSQL config

Edit the file `config.js` and set your own connection informations
