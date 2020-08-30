const fs = require("fs").promises
const path = require("path")
const chalk = require("chalk")

const PACKAGE = require("../package.json")
const NANO_CONFIG = require("../nano.config.json")
const ROOT = path.join(__dirname, "..")
const PROMISES = []

async function updateNanoConfig() {
  if (NANO_CONFIG.debug) {
    NANO_CONFIG.debug = false
    await fs.writeFile(
      path.join(ROOT, "nano.config.json"),
      JSON.stringify(NANO_CONFIG)
    )
    console.log(chalk.blueBright("UPDATED"), "nano.config.json")
  }
}

async function updatePackage() {
  {
    // version
    const pattern = /^v(\d+)\.(\d+)\.(\d+)-(.+)$/
    const [, version, release, patch, state] = pattern.exec(PACKAGE.version)
    PACKAGE.version = `v${version}.${release}.${Number(patch) + 1}-${state}`
  }
  {
    // commit message
    const pattern = /^(git commit -m ).+$/
    const [, command] = pattern.exec(PACKAGE.scripts.commit)
    PACKAGE.scripts.commit = `${command}"patch to ${PACKAGE.version}"`
  }

  await fs.writeFile(path.join(ROOT, "package.json"), JSON.stringify(PACKAGE))

  console.log(chalk.blueBright("UPDATED"), "package.json")
}

async function updateReadme() {
  const readme = await fs.readFile(path.join(ROOT, "readme.md"), {
    encoding: "utf8",
  })
  const pattern = /(## Dependencies\s+)(!.+)(\s+## Template usage)/s

  const [, start, deps, end] = pattern.exec(readme)

  const newDeps = Object.keys(PACKAGE.dependencies)
    .map((dep) => {
      return `![${dep}](https://img.shields.io/github/package-json/dependency-version/CamilleAbella/NanoTemplate/${dep}?color=orange&style=plastic)`
    })
    .join("\n")

  await fs.writeFile(
    path.join(ROOT, "readme.md"),
    readme.replace(pattern, start + newDeps + end)
  )

  console.log(chalk.blueBright("UPDATED"), "readme.md")
}

PROMISES.push(updateNanoConfig(), updatePackage(), updateReadme())

Promise.all(PROMISES)
  .then(() => {
    console.log(
      chalk.greenBright("READY"),
      chalk.magentaBright(PACKAGE.version)
    )
  })
  .catch(console.error)
