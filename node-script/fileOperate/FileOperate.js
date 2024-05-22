const fs = require('fs');
const defaultConfig = require("./config.json");

class FileOperate {
    constructor(config) {
      this.config = config;
    }
    move(oldPath,newPath){
        fs.renameSync(oldPath,newPath);
    }

}