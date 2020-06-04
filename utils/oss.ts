import crypto from 'crypto-js';

/**
 * 前端直传阿里oss帮助类（会将accessKeyId和accessKeySecret暴露在前端，有后端支持的情况下不推荐使用）
 */
class OssHelper {
  constructor(options) {
    this.accessKeyId = options.accessKeyId;
    this.accessKeySecret = options.accessKeySecret;
    this.timeOut = options.timeout || 1;
    this.maxSize = options.maxSize || 10;
  }
  accessKeyId: string;
  accessKeySecret: string;
  timeOut: number;
  maxSize: number;
  createUploadParams() {
    const policy = this.getPolicyBase64();
    const signature = this.signature(policy);
    const objectKey = Date.now().toString();
    return {
      accessid: this.accessKeyId,
      policy: policy,
      signature: signature,
    };
  }

  getPolicyBase64() {
    let date = new Date();
    // 设置 policy 过期时间
    date.setHours(date.getHours() + this.timeOut);
    let srcT = date.toISOString();
    const policyText = {
      expiration: srcT,
      conditions: [
        // 限制上传大小
        ['content-length-range', 0, this.maxSize * 1024 * 1024],
      ],
    };
    return crypto.enc.Base64.stringify(crypto.enc.Utf8.parse(JSON.stringify(policyText)));
    // const buffer = new Buffer(JSON.stringify(policyText));
    // return buffer.toString('base64');
  }
  signature(policy) {
    return crypto.enc.Base64.stringify(crypto.HmacSHA1(policy, this.accessKeySecret));
    // return crypto.createHmac('sha1', this.accessKeySecret).update(policy).digest().toString('base64');
  }
}
const oss = new OssHelper({
  accessKeyId: 'accessKeyId',
  accessKeySecret: 'accessKeySecret',
  timeout: 24, // 限制参数的有效时间(单位: 小时)
  maxSize: 10, // 限制上传文件大小(单位: Mb)
}).createUploadParams();
export default oss;
