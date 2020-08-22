![nano banner](img/banner.jpg)

# Nano (なの) Template ![](img/logo.png) ![GitHub forks](https://img.shields.io/github/forks/CamilleAbella/NanoTemplate?color=black&logo=github&style=for-the-badge) ![GitHub stars](https://img.shields.io/github/stars/CamilleAbella/NanoTemplate?color=black&logo=github&style=for-the-badge) ![GitHub watchers](https://img.shields.io/github/watchers/CamilleAbella/NanoTemplate?color=black&logo=github&style=for-the-badge)

![GitHub top language](https://img.shields.io/github/languages/top/CamilleAbella/NanoTemplate?color=%23BDB76B&style=plastic)
![GitHub search hit counter](https://img.shields.io/github/search/CamilleAbella/NanoTemplate/todo?color=%23BDB76B&label=todo%20count&style=plastic)
![GitHub repo size](https://img.shields.io/github/repo-size/CamilleAbella/NanoTemplate?color=%23BDB76B&label=size&style=plastic)
![GitHub All Releases](https://img.shields.io/github/downloads/CamilleAbella/NanoTemplate/total?color=%23BDB76B&style=plastic)
![GitHub issues](https://img.shields.io/github/issues/CamilleAbella/NanoTemplate?color=%23BDB76B&style=plastic)
![GitHub release (latest by date including pre-releases)](https://img.shields.io/github/v/release/CamilleAbella/NanoTemplate?color=%23BDB76B&include_prereleases&style=plastic)

A Discord bot template in TypeScript

## Dependencies

![GitHub package.json dependency version (prod)](https://img.shields.io/github/package-json/dependency-version/CamilleAbella/NanoTemplate/discord.js?color=orange&style=plastic)
![GitHub package.json dependency version (prod)](https://img.shields.io/github/package-json/dependency-version/CamilleAbella/NanoTemplate/enmap?color=orange&style=plastic)
![GitHub package.json dependency version (prod)](https://img.shields.io/github/package-json/dependency-version/CamilleAbella/NanoTemplate/chalk?color=orange&style=plastic)
![GitHub package.json dependency version (prod)](https://img.shields.io/github/package-json/dependency-version/CamilleAbella/NanoTemplate/dotenv?color=orange&style=plastic)
![GitHub package.json dependency version (prod)](https://img.shields.io/github/package-json/dependency-version/CamilleAbella/NanoTemplate/better-sqlite3?color=orange&style=plastic)
![GitHub package.json dependency version (prod)](https://img.shields.io/github/package-json/dependency-version/CamilleAbella/NanoTemplate/better-sqlite-pool?color=orange&style=plastic)

## Template usage

### 1. Clone the project

- Replace the `Nano` word by your own bot name and run it:  
``git clone --depth 0 -b master https://github.com/CamilleAbella/NanoTemplate.git Nano``

### 2. Prepare project

1. Go to your folder project and run `npm i`
2. Make a `.env` file and place your token inside like this: `TOKEN=Your_Discord_App_Token`
3. Ajuste properties of `"bot"` entry in `package.json`
4. Create and link your own GitHub repository.

### 3. Code your bot in TypeScript

- Please do not code in the `index.ts`.
- Please hard keep the existing files. 
- Please keep the existing commands and events too.
- Please use `src/app/Embed.ts` class to make embeds.
- Add your own commands in `src/commands/`.
- Add your own events in `src/events/`.
- Check the other commands and events for examples.
- The Discord client is in the `src/app/Globals.ts` file as `client`.
- The ApplicationClient is fetched in the `src/app/Globals.ts` file as `bot`.

### 4. Scripts explanation

```json5
{
  // Prettify the code automatically on build or push action.
  "prettier": "prettier src --write",
  
  // Create the local "dist" runnable folder for deployment.
  "build": "git rm -r --ignore-unmatch -f ./dist && npm run prettier && tsc",

  // Build and start directly the bot for debugging.
  "start": "npm run build && node --trace-warnings .",

  // Fallback push script in case time is short.
  "push": "npm run prettier && git add * && git commit -m continue && git push origin master"
}
```
