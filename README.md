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

    export NODE_ENV=bundle
    npm run bundle

Then deploy ~/.m2/repository/org/tomitribe/mykola/mykola/current/mykola-current.war on any Servlet server as /mykola context.
