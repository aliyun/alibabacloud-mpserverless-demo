'use strict';

const AlipaySDK = require('alipay-sdk').default;
const fs = require('fs');

const str = fs.readFileSync(__dirname + '/private-pkcs8.pem').toString()

const privateKey = (str && str.indexOf('-----BEGIN') !== -1)
  ? str
  : `-----BEGIN PRIVATE KEY-----\n${str}\n-----END PRIVATE KEY-----`;

module.exports = async ctx => {
  const alipaySdk = new AlipaySDK({
    appId: '*****************',
    privateKey,
    keyType: 'PKCS8',
  });

  const { code } = ctx.args;
  try {
    const result = await alipaySdk.exec('alipay.system.oauth.token', {
      grantType: 'authorization_code',
      code,
      refreshToken: 'token'
    });
    return {
      message: JSON.stringify(result)
    }
  } catch (e) {
    ctx.logger.error(e);
    return {
      success: false,
      error: {
        code: 'CashCreatedFail',
        message: JSON.stringify(e)
      }
    }
  }
};
