# enhanced-publish

## installing

- run `npm install -g enhanced-publish`
- use npx to run and execute the package

## usage

The package is a command line tool that can be used to publish your package to npm.
It works exactly like [npm publish](https://docs.npmjs.com/cli/v8/commands/npm-publish) but it also allows you to specify to only publish the package if there is no version conflict.

### --if-possible

The behavior is heavily inspired by lerna's [from-package](https://github.com/lerna/lerna/tree/main/commands/publish#bump-from-package) publishing strategy.

The command adds a flag `--if-possible` to the `npm publish` command and will not publish if the package already exists in the registry.

### --use-preid-as-tag

Will use the '[preid](https://docs.npmjs.com/cli/v8/commands/npm-version#preid)' as the tag. `1.0.0-alpha.1` becomes `--tag alpha` in the publish command.
