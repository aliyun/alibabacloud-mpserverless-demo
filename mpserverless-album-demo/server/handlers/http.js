'use strict';

module.exports = async ctx => {
  // 可以请求 HTTP 和 HTTPS 协议的 web 服务
  const res = await ctx.httpclient.request(
    'https://www.alipay.com/x/notFound.htm'
  );

  return {
    html: res.status === 200 ? res.data : '',
  };
};
