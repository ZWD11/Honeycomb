// 云函数入口文件 (getallmessage.js)
const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});

const db = cloud.database();

exports.main = async (event, context) => {
  try {
    const messages = await db.collection('mymessage').get();
    return {
      success: true,
      data: messages.data,
    };
  } catch (err) {
    console.error('获取留言失败:', err);
    return {
      success: false,
      error: err,
    };
  }
};
