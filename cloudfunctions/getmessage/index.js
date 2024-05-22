// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});

const db = cloud.database();

exports.main = async (event, context) => {
  const { message } = event;
  try {
    await db.collection('mymessage').add({
      data: message,
    });
    return {
      success: true,
    };
  } catch (err) {
    console.error('写入数据库失败:', err);
    return {
      success: false,
      error: err,
    };
  }
};