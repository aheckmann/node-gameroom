
module.exports = function cpyArray(source){
  var ret = []
    , len = source.length
    , i = 0
  for(; i<len;++i)
    ret[i] = source[i];
  return ret
}
