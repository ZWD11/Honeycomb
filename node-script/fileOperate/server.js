const express = require('express')
const Busboy = require('busboy')
const path = require('path')
const fs = require('fs')
const child_process = require("child_process");
const Resize = require("./Resize");

const defaultConfig = require("./config.json");
var app = express();

// 用于上传文件表单
app.get('/', (req, res) => {
  res.send(
    `<!DOCTYPE html>
      <html>
      <body>
        <form action="upload" method="post" enctype="multipart/form-data">
          <h1>选择上传的文件</h1>  
          <input type="file" name="file">
          <input type="submit" value="上传">
        </form>
      </body>
      </html>`
    )
})

// 处理上传文件服务
app.post('/upload', (req, res) => {
  const busboy = new Busboy({ headers: req.headers });
  busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
    if(mimetype.indexOf('image') === -1){
        res.send("仅支持上传图片……");
        return;
    }
    // uploadImg = path.join(__dirname, 'uploads', filename);
    file.pipe(fs.createWriteStream(path.join(__dirname,defaultConfig.tempImgPath)));
  });

  busboy.on('finish', async function () {
    const config = {
        width: 200,
        height: 439
    };
    const tempImgPath = path.join(__dirname,defaultConfig.tempImgPath);
    const resize = new Resize(tempImgPath,config);
    await resize.resizeImage();
    const cmdListBefore = [
        `cd ${defaultConfig.giteeProjectPath}`,
        `git pull`
    ]
    cmdListBefore.map(cmd=>{
        try {
            const res = child_process.execSync(cmd);
            console.log(cmd);
        } catch (e) {}
    });
    fs.renameSync(path.join(__dirname,defaultConfig.tempImgPath),path.join(__dirname,defaultConfig.giteeImgPath));
    const cmdList = [
        `cd ${defaultConfig.giteeProjectPath}`,
        `git add .`,
        `git commit -m 更新群聊二维码`,
        `git push origin master`,
        // `cd ./node-script/fileOperate`,
    ];
    cmdList.map(cmd=>{
        try {
            const res = child_process.execSync(cmd);
            console.log(cmd);
        } catch (e) {}
        // console.log(res);
    });
    res.send("文件上传成功");
  });

  return req.pipe(busboy);
});


app.listen(3003, function () {
  console.log('服务启动成功：http://localhost:3003');
});
