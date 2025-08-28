#!/usr/bin/env node

// @ts-check

const { spawn } = require("child_process")
const { readFileSync } = require("fs")
const pacote = require("pacote")

function getPackageInfo() {
  const pJson = JSON.parse(readFileSync("./package.json", "utf8"))

  return {
    name: pJson.name,
    version: pJson.version,
  }
}

async function existsPackageInRegistry(pkg) {
  return await pacote.packument(pkg.name).then(
    (packument) => {
      if (packument.versions === undefined) return false
      return packument.versions[pkg.version] !== undefined
    },
    () => {
      console.warn(`Unable to determine published version, assuming ${pkg.name} unpublished.`)
      return false
    }
  )
}

const newFlags = ["--if-possible", "--use-preid-as-tag"]

async function run() {
  if (process.argv.includes("--help") || process.argv.includes("-h")) {
    console.log(`This command will publish your package to the npm registry. It adds the following flags to the original publish command:
    --if-possible - If the package is already published, it will not publish it again.
    --use-preid-as-tag - Will use the 'preid' as the tag. e.g. '1.0.0-alpha.1' -> '--tag alpha'`)
    process.exit(0)
  }

  const pkg = getPackageInfo()

  const semverWithPreidRegex = /^\d+\.\d+\.\d+(?:-([a-z0-9]+)(?:\.\d+)+)?$/
  const semverMatches = semverWithPreidRegex.exec(pkg.version)

  if (process.argv.includes("--only-prerelease")) {
    console.log("Only prerelease packages will be published.")

    if (!semverMatches || !semverMatches[1]) {
      console.error(`The version '${pkg.version}' of package '${pkg.name}' is not a prerelease version, aborting.`)
      process.exit(0)
    }
  }

  const isPublished = await existsPackageInRegistry(pkg)

  if (process.argv.includes("--if-possible") && isPublished) {
    console.log(`${pkg.name} with version ${pkg.version} is already published.`)
    process.exit(0)
  }

  let args = [...process.argv]
  args.splice(0, 2)
  args = args.filter((arg) => !newFlags.includes(arg))

  if (process.argv.includes("--use-preid-as-tag") && semverMatches && semverMatches[1]) {
    const preid = semverMatches[1]
    args.push("--tag", preid)
  }

  const child = spawn("npm", ["publish", ...args], { stdio: "inherit" })
  child.on("exit", (code) => process.exit(code ?? 0))
}

run()
