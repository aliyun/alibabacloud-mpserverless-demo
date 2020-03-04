'use strict';

module.exports = async function (ctx) {
  return await ctx.basement.db.collection('todos').find();
};

