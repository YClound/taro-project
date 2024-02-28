/// <reference types="@tarojs/taro" />

declare module '*.png';
declare module '*.gif';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.svg';
declare module '*.css';
declare module '*.less';
declare module '*.scss';
declare module '*.sass';
declare module '*.styl';

declare namespace NodeJS {
  interface ProcessEnv {
    /** NODE 内置环境变量, 会影响到最终构建生成产物 */
    NODE_ENV: 'development' | 'production',
    /** 当前构建的平台 */
    TARO_ENV: 'weapp' | 'swan' | 'alipay' | 'h5' | 'rn' | 'tt' | 'quickapp' | 'qq' | 'jd'
    /**
     * 当前构建的小程序 appid
     * @description 若不同环境有不同的小程序，可通过在 env 文件中配置环境变量`TARO_APP_ID`来方便快速切换 appid， 而不必手动去修改 dist/project.config.json 文件
     * @see https://taro-docs.jd.com/docs/next/env-mode-config#特殊环境变量-taro_app_id
     */
    TARO_APP_ID: string
  }
}

declare const $TRACE: boolean; // 是否开启埋点

declare const $APP_ID: string;

declare const $APP_NAME: string;

declare const $APP_KEY: string;

declare const $SOURCE: string;

// eslint-disable-next-line no-unused-vars
declare const my: {
  getTitleColor: any,
  navigateTo: any,
  reLaunch: any,
  navigateBack: any,
  redirectTo: any,
  setNavigationBar: any,
  showNavigationBarLoading: any,
  hideNavigationBarLoading: any,
  hideBackHome: any,
  switchTab: any,
  hideTabBar: any,
  hideTabBarRedDot: any,
  removeTabBarBadge: any,
  setTabBarBadge: any,
  setTabBarItem: any,
  setTabBarStyle: any,
  showTabBarRedDot: any,
  showTabBar: any,
  alert: any,
  prompt: any,
  showToast: any,
  hideLoading: any,
  hideToast: any,
  showLoading: any,
  showActionSheet: any,
  startPullDownRefresh: any,
  choosePhoneContact: any,
  chooseAlipayContact: any,
  chooseContact: any,
  chooseCity: any,
  datePicker: any,
  createAnimation: any,
  createCanvasContext: any,
  createMapContext: any,
  hideKeyboard: any,
  pageScrollTo: any,
  createIntersectionObserver: any,
  createSelectorQuery: any,
  optionsSelect: any,
  multiLevelSelect: any,
  setBackgroundColor: any,
  setBackgroundTextStyle: any,
  setCanPullDown: any,
  setOptionMenu: any,
  loadFontFace: any,
  previewImage: any,
  setStorage: any,
  setStorageSync: any,
  getStorage: any,
  getStorageSync: any,
  removeStorage: any,
  removeStorageSync: any,
  clearStorage: any,
  clearStorageSync: any,
  getStorageInfo: any,
  getStorageInfoSync: any,
  saveFile: any,
  getFileInfo: any,
  getSavedFileInfo: any,
  getSavedFileList: any,
  removeSavedFile: any,
  getLocation: any,
  openLocation: any,
  chooseLocation: any,
  request: any,
  uploadFile: any,
  downloadFile: any,
  connectSocket: any,
  onSocketOpen: any,
  offSocketOpen: any,
  onSocketError: any,
  offSocketError: any,
  sendSocketMessage: any,
  onSocketMessage: any,
  offSocketMessage: any,
  closeSocket: any,
  onSocketClose: any,
  offSocketClose: any,
  canIUse: any,
  SDKVersion: any,
  getSystemInfo: any,
  getSystemInfoSync: any,
  getNetworkType: any,
  onNetworkStatusChange: any,
  offNetworkStatusChange: any,
  getClipboard: any,
  setClipboard: any,
  watchShake: any,
  vibrate: any,
  vibrateShort: any,
  onAccelerometerChange: any,
  offAccelerometerChange: any,
  onGyroscopeChange: any,
  offGyroscopeChange: any,
  onCompassChange: any,
  offCompassChange: any,
  makePhoneCall: any,
  getServerTime: any,
  onUserCaptureScreen: any,
  offUserCaptureScreen: any,
  setKeepScreenOn: any,
  getScreenBrightness: any,
  setScreenBrightness: any,
  openSetting: any,
  getSetting: any,
  addPhoneContact: any,
  showAuthGuide: any,
  scan: any,
  onMemoryWarning: any,
  offMemoryWarning: any,
  getBatteryInfo: any,
  getBatteryInfoSync: any,
  startBeaconDiscovery: any,
  stopBeaconDiscovery: any,
  getBeacons: any,
  onBeaconUpdate: any,
  onBeaconServiceChange: any,
  rsa: any,
  hideShareMenu: any,
  showSharePanel: any,
  isCollected: any,
  getRunScene: any,
  reportAnalytics: any,
  getUpdateManager: any,
  getAuthCode: any,
  getPhoneNumber: any,
  tradePay: any,
  addCardAuth: any,
  textRiskIdentification: any,
  navigateToMiniProgram: any,
  navigateBackMiniProgram: any,
  createWebViewContext: any,
  getRunData: any,
  [key: string]: any
};

// eslint-disable-next-line no-unused-vars
declare const getApp: () => any;

// eslint-disable-next-line no-unused-vars
declare const getCurrentPages: () => any;

// eslint-disable-next-line no-unused-vars
declare const requirePlugin: (name: string) => any

declare let Page: any;


