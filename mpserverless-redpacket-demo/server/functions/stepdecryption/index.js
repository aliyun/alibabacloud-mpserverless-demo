'use strict';

const crypto = require('crypto');
const aesSecret = '***************';

module.exports = async (ctx) => {
  const step = ctx.args.step;
  if (!step) {
    return {
      success: false,
      error: {
        code: 'InvalidParameter',
        message: '待解密部署不能为空'
      }
    }
  }
  try {
    ctx.logger.info('[args]', ctx.args);
    const crypted = Buffer.from(step, 'base64').toString('binary');
    const key = Buffer.from(aesSecret, 'base64');
    const iv = Buffer.alloc(16, 0);
    const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
    let decoded = decipher.update(crypted, 'binary', 'utf8');
    decoded += decipher.final('utf8');

    return {
      success: true,
      data: decoded
    }
  } catch (e) {
    ctx.logger.error(e);
    return {
      success: false,
      error: {
        code: 'DecipheStepFail',
        message: e.message
      }
    }
  }

}

