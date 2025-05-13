# Demokratia
## _Discord bot_

Not currently maintained
Discord bot for rating, choosing and listing movie sessions with friends.
Written in Typescript  with [discord.js](https://discord.js.org/#/)

## Installation

Install the dependencies and devDependencies and start the server.

It uses cros-env to set enviroment variables for different platforms.

For development

```sh
npm i
npm run start:dev
```

For production (Compiles to javascript)

```sh
npm run start:prod
```

Command files must be named index.ts and be located in src/commands/CATEGORY/COMMAND_NAME/index.ts, so you can use other auxiliary files in the same folder and keep things organized.
