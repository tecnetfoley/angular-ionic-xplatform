const arch = process.env.ARCH || process.arch;
const platform = process.env.PLATFORM || process.platform;


module.exports = {
    target: 'electron-renderer',
    externals: {
      // "better-sqlite3": "commonjs better-sqlite3", Example better-sqlite3
      // sqlite3: "commonjs sqlite3" Example sqlite3 
    },    
    // module: {
    //   rules: [
    //     {
    //       test: /\.node$/,
    //       use: 'node-loader'
    //     }
    //   ]
    // }
    
  };