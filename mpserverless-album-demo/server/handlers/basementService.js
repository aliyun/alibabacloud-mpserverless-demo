'use strict';

module.exports = async ctx => {
  // 可以在云函数中直接访问同一个云服务中的数据库资源
  const collectionNames = await ctx.basement.db.collections();

  return collectionNames;
};
