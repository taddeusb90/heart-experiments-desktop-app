/**
 * Custom angular webpack configuration
 */

module.exports = (config, options) => {
  config.target = 'electron-renderer';
  //   config.externals = {
  // bindings: true,
  // serialport: "serialport"
  // serialport: 'require("serialport")'
  //   };
  //   bindings: true,
  //   serialport: true,

  if (options.customWebpackConfig.target) {
    config.target = options.customWebpackConfig.target;
  } else if (options.fileReplacements) {
    for (let fileReplacement of options.fileReplacements) {
      if (fileReplacement.replace !== 'src/environments/environment.ts') {
        continue;
      }

      let fileReplacementParts = fileReplacement['with'].split('.');
      if (['dev', 'prod', 'test', 'electron-renderer'].indexOf(fileReplacementParts[1]) < 0) {
        config.target = fileReplacementParts[1];
      }
      break;
    }
  }

  return config;
};
