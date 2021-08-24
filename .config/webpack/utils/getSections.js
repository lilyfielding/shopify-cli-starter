const fs = require("fs");
const path = require("path");

module.exports = function () {
  const entrypoints = {};
  const filePath = path.resolve(__dirname, "../../../src/sections/scripts/");

  fs.readdirSync(filePath).forEach((file) => {
    const name = path.parse(file).name;
    const jsFile = path.join(filePath, `${name}.js`);

    if (fs.existsSync(jsFile)) {
      entrypoints[`${name}.section`] = jsFile;
    }
  });

  return entrypoints;
};
