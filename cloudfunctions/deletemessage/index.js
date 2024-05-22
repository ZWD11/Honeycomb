const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

exports.main = async (event, context) => {
  try {
    return await db.collection('mymessage').doc(event.id).remove() // 使用 event.id 获取要删除的留言的 _id
  } catch (e) {
    console.error(e)
  }
}
