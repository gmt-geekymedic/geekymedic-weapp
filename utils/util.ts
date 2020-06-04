/**
 * 获取调用链跟踪ID
 */
export const getTrace = () => {
  let randomNumber = (((1 + Math.random()) * 0x10000) | 0).toString(16);
  let time = new Date().getTime();
  let trance = randomNumber + time;
  return trance;
};
let currentSequence = 0;
/**
 * 获取调用序列
 */
export const getSequence = () => {
  return currentSequence++;
};
/**
 * 获取时间戳
 */
export const getTime = () => {
  return new Date().getTime();
};
/**
 * 手机号码中间4位打星号
 * @param tel
 */
export const encodePhoneNumber = (tel: string) => {
  tel = tel || '';
  var reg = /(\d{3})\d{4}(\d{4})/;
  return tel.replace(reg, '$1****$2');
};
/**
 * 阿里oss图片处理,转为png格式，以解决部分浏览器img标签不支持带orientation的jpg
 * @param arr 数组
 * @param imgPropertyName 属性名，为空时直接修改数组，默认为空
 */
export const ossProcess = (arr: any, imgPropertyName?: string) => {
  if (!arr) {
    return;
  }
  if (Array.isArray(arr)) {
    return arr.map((l) => ossProcess(l, imgPropertyName));
  } else {
    if (imgPropertyName) {
      if (arr[imgPropertyName]) {
        arr[imgPropertyName] += '?x-oss-process=image/resize,w_750/format,png';
      }
      return arr;
    } else {
      return arr + '?x-oss-process=image/resize,w_750/format,png';
    }
  }
};
