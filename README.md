
# Solution to coding challenge at https://github.com/Primephonic/backend-engineer-assignment

## Install

```
npm install
```

## Start the project

```
npm run build-and-start
```

Listens at `http://localhost:3000`

### To trigger consolidation process just navigate/curl to 

`http://localhost:3000/build`

### Available endpoints

* /build Consolidates data
* /revenue returns total revenue
* /consolidated returns consolidated data collection
* /users/:userId Returns user and seconds streamed for it
* /users Returns all users and their streamed seconds
* /report returns the amount to be assigned per label`

### Test

Simply run
```
npm run test
```

# Architecture

The solution to the requirement was implemented using
* Typescript
* ES6
* Jest.

There is a controllers layer and a service layer which acceses to a the data resides in memory in a Singleton object (no DB added, to avoid complicating the solution).
Configuration is in config/default.json.


##### The solution was designed to process the external data files and the api without blocking the event loop, by partitioning the processing job. Although the I/O is async, the consolidation runs all in memory and traverses (presumably) long in memory collections for the streamings and the users, which can be considered a CPU bound and blocking task for the event loop. To avoid blocking it I decided to partition the long job by using the setImmediate method, stopping after `partitioning-time` (in config file) milliseconds, and rescheduling the next chunk of data for the next execution.

### Possible improvements

* Clusterize the solution, to have multiple processes serving the app, leveraging all CPU cores with real parallelization. It would require a real database such as (Mongo, Redis, etc).
* Avoid having the entire streamings and users collections in memory, whcih can be accomplished by processing the chunks/streams of the csv file reading and persisting them right away to a DB. Since this demo solution is all in memory this improvement made no sense here.
