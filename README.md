# mykola
 -Angular UI Component library named after famous Ukrainian composer, Mykola Leontovych

Styleguide for 1.5 components
https://github.com/toddmotto/angular-styleguide#es2015-and-tooling

npm publish testing

#DEMO

How to use server
```sh
npm i webpack typings typescript webpack-dev-server -g
npm i
npm start
```

If you prefer docker
```
docker-compose run -p 8082:8082 npm start
```

Check demo page at:
http://localhost:8082/

Component example:
https://github.com/Dexmaster/angular-component-tr

Use example:
https://github.com/Dexmaster/mykola/commit/a933807a49c1d78dcf71a390186183eb7702f801

#DOCS

How to use docs:
```sh
npm i webpack typings typescript webpack-dev-server -g
npm i
gulp
```

Check docs page at:
http://localhost:8083/

# Bundle (deployment)

This fully rely on maven build

# if you are a java guy

If you use maven just running:

    mvn clean
    mvn frontend:npm@install
    mvn frontend:npm@start

will download/setup node and npm, install dependencies and launch

    npm start

Then you can access the demo page at http://localhost:8082/

See the pom for commented executions wrapping npm commands.
