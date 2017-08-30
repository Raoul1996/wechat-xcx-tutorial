'use strict'
import Promise from '../lib/promise'
import config from './config'
import * as Mock from './mock'

let util = {
  // is env === dev, console the log of arguments array
  isDev: config.isDev,
  log() {
    this.isDev && console.log(...arguments) //arguments数组是所有形参的集合，js这种变态的传参方式啊
  },

  alert(title = '提示', content = config.defaultAlertMsg) {
    // in the development env,we add the alert msg of the object
    if ('object' === typeof content) {
      content = this.isDev && JSON.stringify(content) || config.defaultAlertMsg
    }
    wx.showModal({
      title: title,
      content: content
    })
  },

  /**
   * 异步获取本地缓存中的内容
   * @param key 指定的key值
   * @param cb callback函数
   * @returns {function(*)}
   * */
  getStorage(key, cb) {
    let self = this
    wx.getStorage({
      key: key,
      success(res) {
        cb && cb(res.data)
      },
      fail(err) {
        let msg = err.errMsg || ''
        if (/getStorage:fail/.test(msg)) {
          self.setStorage(key)
        }
      },
      complete() {
        console.log('get Storage complete')
      }
    })
  },
  /**
   * 异步将内容存入本地缓存
   * @param key 指定的key值
   * @param value 存入的内容
   * @param cb callback函数
   * @returns {function()}
   * */
  setStorage(key, value = '', cb) {
    // 将数据存储到本地缓存指定的 key 中，会覆盖掉原来该 key 的内容，异步接口
    wx.setStorage({
      key: key,
      data: value,
      success() {
        cb && cb()
        console.log('set localStorage successful')
      },
      fail(err) {
        console.log(err)
      }
    })
  }

}
export default util