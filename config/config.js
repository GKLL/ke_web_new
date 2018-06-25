/*
 * @Description: 全局配置文件
 * @Author: LiuZhen
 * @Date: 2018-05-30 10:08:14
 * @Last Modified by: LiuZhen
 * @Last Modified time: 2018-06-20 13:44:47
 */
export const OSS_ADDRESS = process.env.__ENV === 'production'
                           ? 'https://pro-kg-oss.oss-cn-beijing.aliyuncs.com/'
                           : 'https://kgcom.oss-cn-shenzhen.aliyuncs.com/'

// 配置WebSocket链接地址
export const WEBSOCKET_ADDRESS = process.env.__ENV === 'production'
                                 ? 'wss://snatch.kg.com/'
                                 : 'wss://testsnatch.kg.com/'

// token命名
export const WEBSTORAGE_TOKEN_NAME = 'kg_desk_token'


//图片上传
const location_host = '';
export const UPLOAD_IMG_ADDRESS = () =>{
  if(location_host.indexOf('dev.kg.com') != '-1'){
    return 'https://dev.kg.com/image/upload'
  }else if(location_host.indexOf('test.kg.com') != '-1'){
    return 'https://test.kg.com/image/upload'
  }else{
    return 'https://kg.com/image/upload'
  }
};

// 获取自定义系统变量用于识别当前运行环境，并输出api地址
const distingNodeEnv = () => {
  switch (process.env.__ENV) {
    case 'production':
      return 'https://www.kg.com/kgapi/'
      break
    case 'test':
      return 'https://t.kg.com/kgapi/'
      break
    case 'development':
      return 'https://dev.kg.com/'
      break
    default:
      return new Error()
  }
}

export const apiByENV = distingNodeEnv()
