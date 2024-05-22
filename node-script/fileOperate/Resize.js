// Resize.js
const fs = require('fs')
const sharp = require('sharp');
const path = require('path')

class Resize {
  constructor(img,config) {
    this.img = img;
    this.config = config;
  }
  async resizeImage() {
    try {
        let imgPath = this.img;
        imgPath = imgPath.split('.');
        const append = imgPath.pop();
        const newPath = imgPath.join('.') + '-resize.' + append;
        await sharp(this.img)
          .resize(this.config)
          .toFile(newPath);
        fs.renameSync(newPath,this.img);
      } catch (error) {
        console.log('error',error);
      }
  }
}
module.exports = Resize;