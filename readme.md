![nano banner](https://raw.githubusercontent.com/CamilleAbella/Nano/master/assets/images/banner.jpg)

![GitHub forks](https://img.shields.io/github/forks/CamilleAbella/NanoTemplate?color=black&logo=github&style=for-the-badge) ![GitHub stars](https://img.shields.io/github/stars/CamilleAbella/NanoTemplate?color=black&logo=github&style=for-the-badge) ![GitHub watchers](https://img.shields.io/github/watchers/CamilleAbella/NanoTemplate?color=black&logo=github&style=for-the-badge)

# Nano (なの) Module ![](https://raw.githubusercontent.com/CamilleAbella/Nano/master/assets/images/logo.png)

![GitHub top language](https://img.shields.io/github/languages/top/CamilleAbella/NanoTemplate?color=%23BDB76B&style=plastic)
[![GitHub search todo](https://img.shields.io/github/search/CamilleAbella/NanoTemplate/todo?color=%23BDB76B&label=todo%20count&style=plastic)](https://github.com/CamilleAbella/NanoTemplate/search?l=TypeScript&q=todo)
![GitHub repo size](https://img.shields.io/github/repo-size/CamilleAbella/NanoTemplate?color=%23BDB76B&label=size&style=plastic)
![GitHub All Releases](https://img.shields.io/github/downloads/CamilleAbella/NanoTemplate/total?color=%23BDB76B&style=plastic)
![GitHub issues](https://img.shields.io/github/issues/CamilleAbella/NanoTemplate?color=%23BDB76B&style=plastic)
![GitHub release (latest by date including pre-releases)](https://img.shields.io/github/v/release/CamilleAbella/NanoTemplate?color=%23BDB76B&include_prereleases&style=plastic)

A Discord bot template in TypeScript

## Dependencies

![querystring](https://img.shields.io/github/package-json/dependency-version/CamilleAbella/NanoTemplate/querystring?color=orange&style=plastic)

## Template usage

### 1. Clone the project

- Follow the [Use this template](https://github.com/CamilleAbella/NanoTemplate/generate) link.
- Clone your new repository as your project name.

### 2. Prepare project

1. Go to your folder project and run `npm i`.
2. Make a `.env` file and place your token inside like this: `TOKEN=Your_Discord_App_Token`.
3. Adjust properties in `nano.config.json`.

### 3. Code your bot in TypeScript

- Place in the `index.ts` the Nano imports (modules and core in order).
- Please hard keep the existing files.
- Please keep the existing commands and events too.
- Please use `Nano.Embed` class to make embeds.
- Add your own commands in `src/commands/`.
- Add your own events in `src/events/`.
- Add your own modules in `src/modules/`.
- Check the other commands, events and modules for examples.
- The Discord client is in the `Nano.Globals` file as `client`.
- The ApplicationClient is fetched in the `Nano.Globals` file as `bot`.

### 4. Scripts explanation

```json5
{
  // Prettify the code automatically on build or push action.
  prettier: "prettier src --write",

  // Create the local "dist" runnable folder for deployment.
  build: "git rm -r --ignore-unmatch -f ./dist && npm run prettier && tsc",

  // Build and start directly the bot for debugging.
  start: "npm run build && node .",
}
```

## 5. Future features

- Implement hot reloading with Gulp.
