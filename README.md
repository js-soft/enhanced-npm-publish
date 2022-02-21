# enhanced-publish

## installing

- run `npm install -g enhanced-publish`
- use npx to run and execute the package

## usage

The package is a command line tool that can be used to publish your package to npm.
It works exactly like [npm publish](https://docs.npmjs.com/cli/v8/commands/npm-publish) but it also allows you to specify to only publish the package if there is no version conflict.

The behavior is heavily inspired by lerna's [from-package](https://github.com/lerna/lerna/tree/main/commands/publish#bump-from-package) publishing strategy.
