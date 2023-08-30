const path = require("path");
const _ = require("lodash");

/**
 * The difference between using `/*` and not using it in path mapping within the `jsconfig.json` file 
 * is related to how alias paths are resolved.

1. **With `/*` (Wildcard)**:
   When you define an alias path with a `/*` wildcard at the end, like `"alias/*": ["path/*"]`, it 
   tells the compiler to map any import that starts with `"alias/"` to the corresponding path under 
   `"path/"`. For example, if you have an import like `import SomeModule from "alias/someModule"`, the
    compiler will map it to the corresponding module located at `"path/someModule"`.

   This is useful when you have a set of related modules that you want to alias to a common path. It 
   allows you to group them together and make your imports cleaner.

2. **Without `/*`**:
   When you define an alias path without the `/*` wildcard, like `"alias": ["path"]`, it tells the 
   compiler to map the exact alias to the specified path. In this case, the import should match the 
   alias exactly for the mapping to occur. For example, if you have an import like `import SomeModule 
   from "alias"`, the compiler will map it to the corresponding module located at `"path"`.

   This is useful when you have a specific module or folder that you want to alias directly without 
   needing to include any additional sub-paths.

In your specific scenario:

- `"commonComponents/*": ["./src/commonComponents/*"]` with the `/*` wildcard is used to map any import 
starting with `commonComponents/` to the corresponding path under `./src/commonComponents/`.

- `"commonComponents": ["./src/commonComponents"]` without the `/*` wildcard is used to directly map the 
alias `commonComponents` to the path `./src/commonComponents`.

By using or omitting the `/*` wildcard, you can control whether you want to match imports that start with 
the alias or only the exact alias itself.
 */

function generateWebpackAliasesFromJsConfig() {
  const jsConfig = require("../jsconfig.json");
  const baseUrl = _.get(jsConfig, "compilerOptions.baseUrl", "./");
  const paths = _.get(jsConfig, "compilerOptions.paths", {});

  const aliases = {};

  _.forEach(paths, (values, alias) => {
    const aliasPath = _.first(values).replace("/*", ""); // Remove the wildcard
    const aliasFullPath = path.resolve(baseUrl, aliasPath);
    aliases[alias.replace("/*", "")] = aliasFullPath;
  });

  return aliases;
}

module.exports = { generateWebpackAliasesFromJsConfig };

// Example usage
// const aliases = generateWebpackAliasesFromJsConfig();
// console.log(aliases);
