# Rainbow Web SDK - Conference Sample

![Rainbow](images/logo_rainbow.png)

This repository demonstrates the basic way of using Rainbow Web SDK to organize
a web conference.  The main goal is to demonstrate how to choose a bubble,
start a conference, add various media streams and retrieve distant media
streams.

It is written in pure HTML, CSS and JavaScript in order to not clutter the project with any framework bloat.

## Prerequisites

To run this application locally, you will need to have NodeJS and NPM installed.

Run the following commands in order to start:

`npm install`

`npm i -g webpack webpack-dev-server`

`npm i -S rainbow-web-sdk@latest`

And finally:

`npm run copy`

## Configuration

To run this application, you will need to create a Rainbow application, user
and a bubble called "Conference test" with the participants already invited
(you can do that via [web client](https://web-sandbox.openrainbow.com))

Once it's done, fill config (`./src/scripts/config.js`) file with your
credentials:

```js
const config = {
    appId: 'YOURAPPID',
    appSecret: 'YOURAPPSECRET',
    bubbleName: 'Conference test', // YOU CAN CHANGE IT IF YOU LIKE
};

```

## Running the app

Once everything is prepared, type `npm run serve` in your console. Your browser
should open automatically on `https://localhost:8080/`

## Usage

You will be prompted with a login form. Fill it with the login and password of
your **Sandbox** user.  Once that done, you should see a button **getBubble**
that is responsible for chosing the right bubble to start the conference with.
It will look through all the bubbles that the connected user is a member of an
owner of and chose the one with the name stated in the config file.

If everything goes right up to this point, you should see the conference
methods appear. From there, you can start testing the methods and manipulate
them according to your taste.

