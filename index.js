const { spawn } = require("child_process")
const { readFileSync } = require("fs")
const pacote = require("pacote")

function getPackageInfo() {
  const pJson = JSON.parse(readFileSync("./package.json"))

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

async function run() {
  const pkg = getPackageInfo()
  const isPublished = await existsPackageInRegistry(pkg)

  if (process.argv.includes("--if-possible") && isPublished) {
    console.log(`${pkg.name} with version ${pkg.version} is already published.`)
    process.exit(0)
  } else {
    let args = [...process.argv]
    args.splice(0, 2)
    args = args.filter((arg) => arg !== "--if-possible")

    spawn("npm", ["publish", ...args], { stdio: "inherit" })
  }
}

run()
