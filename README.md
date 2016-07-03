# AngularJS setup including an optimized login

> this is an example how the login could work

## Prepare

> [JWT](https://jwt.io/) are used in this example.

To make this application ready for development you have to change the basic mock data. Lines which can be deleted are signed with `@delete`. `@exampleInstead` is for examples how it could look like.

`src/services/auth/auth.service.js` @ `isCookieValid`

`src/services/auth/auth.service.js` @ `login`

`/src/services/user/user.service.js` @ `getCurrent`

## Usage

> Run `npm install` and `bower install` before use

> Make sure `grunt` is globally installed

### Development

Run `grunt serve` for running the server.

### Production

Run `grunt build:prod` to get the production-ready code.

### Documentation

Run `grunt serve:docs` to see the ngdoc documentation of this small application