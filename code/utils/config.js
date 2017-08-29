'use strict'
const env = 'dev'
/**
 * 默认接口出错弹窗文案
 * @type {string}
 * */
const defaultAlertMessage = 'maybe hava a error,please try again~~~'
/**
 * 默认分享文案
 * @type {{en: string}}
 * */
const defaultShareText = {
  en: 'iKcmap English'
}
/**
 *小程序默认标题栏文字
 * @type{{en:string}}
 * */
const defaultBarTitle = {
  en: 'iKcamp English Study'
}
/**
 * 文章默认图片
 * @type {string}
 * */
const defaultImg = {
  articleImg: 'https://n1image.hjfile.cn/mh/2017/06/07/7e8f7b63dba6fa3849b628c0ce2c2a46.png',
  coverImg: 'https://n1image.hjfile.cn/mh/2017/06/07/7472c035ad7fe4b8db5d2b20e84f9374.png'
}
let core = {
  env: env,
  defaultBarTitle: defaultBarTitle['en'],
  defaultImg: defaultImg,
  defaultAlertMsg: defaultAlertMessage,
  defaultShareText: defaultShareText['en'],
  isDev: env === 'dev',
  isProduction: env === 'production'
}
export default core