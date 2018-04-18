const operate = (...cbs) => src => {
  let res = src;
  const n = cbs.length;
  for (let i = 0; i < n; i++) res = cbs[i](res);
  return res;
};

module.exports = operate;
