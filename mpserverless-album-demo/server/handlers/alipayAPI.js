'use strict';

module.exports = async ctx => {
  // @see https://docs.open.alipay.com/api_2/alipay.user.info.share
  // 可以在云函数中直接调用蚂蚁开放平台 OpenAPI 的接口服务
  const user = await ctx.basement.openapi.alipay.exec('alipay.user.info.share');

  return user;
};
