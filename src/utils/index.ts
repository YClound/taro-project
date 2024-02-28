import dayjs from "dayjs";
import track from "minitrack";
import qs from "qs";

export function format(date, fmt = "YYYY-MM-DD HH:mm") {
	if (!date) return;
	return dayjs(date).format(fmt);
}
/**
 * 获取页面列表
 */
export function getPageList() {
	return getCurrentPages ? getCurrentPages() : [];
}

/**
 * 获取当前页面
 */
export function getCurrentPage() {
	const pageList = getPageList() || [];

	return pageList.length ? (pageList[pageList.length - 1] || {}) : {};
}

let user = {
	platform: "",
	uid: "",
	userId: ""
};
export function setUser(_user) {
	user = _user;
}

export function getUser() {
	return user;
}

/**
 * 显示全局错误提示
 * @param message
 */
export function showErrorNotify(message: string) {
	my.showToast({
		content: message
	});
}

export function genRandomStr(length: number): string {
	const chars = "0123456789abcdefghijklmnopqrstuvwxyz";
	let result = "";

	while (length--) result += chars[Math.floor(Math.random() * chars.length)];

	return result;
}

export function genSessionId() {
	return +new Date() + genRandomStr(16);
}

let _adBizId = null;
export function setAdBizId(adBizId?) {
	return (_adBizId = adBizId || genSessionId());
}
export function getAdBizId() {
	return _adBizId;
}

export const sequence = {
	value: 0,
	get: () => sequence.value,
	set: value => (sequence.value = value)
};

export function object2Query(obj) {
	return Object.keys(obj)
		.map(key => `${key}=${obj[key]}`)
		.join("&");
}

export function genUniPage(link: string) {
	return encodeURIComponent(
		`https://render.alipay.com/p/h5/cloudcode-fe/redirect.html?target=${encodeURIComponent(
			link
		)}`
	);
}

export function navigateToTarget(linkTarget, adBizId?) {
	const { AppQuery } = getApp();
	const { linkAppId = "", linkExtra = "{}", linkUrl = "", linkType = 0 } =
		linkTarget || {};
	const __adBizId = adBizId || _adBizId;

	// const isH5Url = UrlRegexp.h5.test(linkUrl);

	switch (+linkType) {
		// 支付宝小程序跳转
		case 0:
			my.navigateToMiniProgram({
				appId: linkAppId,
				path: linkUrl,
				extraData: linkExtra
					? {
							mediaId: AppQuery.mediaId,
							adSpotId: AppQuery.adSpotId,
							...JSON.parse(linkExtra),
							adBizId: __adBizId,
							shuliNoRecord: true // 对接广告主插件的广告，需要此参数，避免重复计费
					  }
					: {
							mediaId: AppQuery.mediaId,
							adSpotId: AppQuery.adSpotId,
							adBizId: __adBizId,
							shuliNoRecord: true // 对接广告主插件的广告，需要此参数，避免重复计费
					  }
			});
			break;
		// 生活号跳转
		case 1:
			break;
		// 支付宝官方页面跳转
		case 2:
			my.ap.navigateToAlipayPage({
				path: linkUrl.replace(/\${adBizId}/g, __adBizId)
			});
			break;

		// 小程序内部跳转
		case 3:
			my.navigateTo({
				url: linkUrl
			});
			break;
		// 小程序 webview 跳转
		case 4:
			my.navigateTo({
				url: `/pages/webview/index?url=${
					/\?\?\w+/g.test(linkUrl)
						? linkUrl + "&adBizId=" + __adBizId
						: linkUrl + "?adBizId=" + __adBizId
				}`
			});
			break;
	}
}

export function parseAlipayLinkQuery(targetHref?: string) {
	const list = decodeURIComponent(targetHref as string).split("?");
	const filteredParams = list.filter((_, index) => index !== 0);

	// 1个问号
	if (filteredParams.length === 1) {
		const [queryString] = filteredParams;

		if (/query/.test(queryString)) {
			// 查找 query 字段的位置
			const position = queryString.indexOf("query");
			// 拆分 query 左侧字符串
			const leftStr = queryString.slice(0, position - 1);
			// 拆分 query 右侧字符串
			const rightStr = queryString.slice(position);
			// 拆分 query= 后面的参数，长度6表示从 query= 后面开始截取
			const queryStr = rightStr.slice(6);

			return {
				...qs.parse(leftStr),
				query: queryStr
			};
		}

		return qs.parse(queryString);
	}

	// 多个问号
	const [url, paramStr, queryString] = filteredParams;
	const result = qs.parse(url);
	// const params = qs.parse(paramStr);
	// 小程序
	if (result.page && /query/.test(paramStr)) {
		// FIXME: 前缀 + appId + page(不包含URL) + query

		// 查找 query 字段的位置
		const position = paramStr.indexOf("query");
		// 拆分 query 左侧字符串
		const leftStr = paramStr.slice(0, position - 1);
		// 拆分 query 右侧字符串
		const rightStr = paramStr.slice(position);
		// 拆分 query= 后面的参数，长度6表示从 query= 后面开始截取
		const queryStr = rightStr.slice(6);

		result.page += `?${leftStr}`;
		result.query = queryStr;
	} else if (result.page && /query/.test(queryString)) {
		// FIXME: 前缀 + appId + page(包含URL) + query

		// 查找 query 字段的位置
		const position = queryString.indexOf("query");
		// 拆分 query 左侧字符串
		const leftStr = queryString.slice(0, position - 1);
		// 拆分 query 右侧字符串
		const rightStr = queryString.slice(position);
		// 拆分 query= 后面的参数，长度6表示从 query= 后面开始截取
		const queryStr = rightStr.slice(6);

		result.page += `?${paramStr}?${leftStr}`;
		result.query = queryStr;
	} else if (result.page && paramStr) {
		// FIXME: 不带 query
		result.page += queryString ? `?${paramStr}?${queryString}` : `?${paramStr}`;
	}

	// H5
	if (result.url && paramStr) {
		result.url += `?${paramStr}`;
	}

	return result;
}

export function jumpToMiniapp(linkUrl) {
	if (linkUrl.indexOf("http") === 0) {
		if (linkUrl.indexOf("https://render.alipay") > -1) {
			my.ap.navigateToAlipayPage
				? my.ap.navigateToAlipayPage({
						path: linkUrl,
						fail: error => trackjumpErrClick(linkUrl, error)
				  })
				: my.ap.openURL({
						url: linkUrl,
						fail: error => trackjumpErrClick(linkUrl, error)
				  });
		} else {
			my.showToast({
				content: "活动太火爆了，等下再试试吧～"
			});
		}
		return;
	}

	if (linkUrl.indexOf("alipays://") > -1) {
		const linkQuery = parseAlipayLinkQuery(linkUrl);
		let path = linkQuery.page;
		let extraData = {};
		if (linkQuery.query) {
			// path = path + (path.indexOf("?") > -1 ? "&" : "?") + linkQuery.query;

			extraData = linkQuery.query.split("&").reduce((pre: any, str: string) => {
				if (str && str.indexOf("=") !== -1) {
					let [key = "", value = ""] = str.split("=");
					if (key) {
						pre[key] = value;
					}
				}
				return pre;
			}, extraData);
		}

		my.navigateToMiniProgram({
			appId: linkQuery.appId,
			path,
			extraData,
			query: extraData || {},
			fail: error => trackjumpErrClick(linkUrl, error)
		});
		return;
	}

	if (linkUrl.indexOf("/pages") > -1) {
		my.navigateTo({
			url: linkUrl,
			fail: error => trackjumpErrClick(linkUrl, error)
		});
		return;
	}

	my.showToast({
		content: "活动太火爆了，等下再试试吧～"
	});
}

export function trackjumpErrClick(url, error) {
	return track({
		bid: "jumpFalied",
		eventName: "跳转失败",
		url: url,
		extParams: {
			error: JSON.stringify(error)
		}
	});
}

/**
 * 数字
 * @param {number} number 数字
 */
export const isNumber = number => {
	return Object.prototype.toString.call(number) === "[object Number]";
};

/**
 * 时间个位补0
 * @param { number } str 月日 时分秒
 */
export function dateCompletion(str) {
	return +str >= 10 ? str : `0${str}`;
}

/**
 * 格式化时间
 * @param {number} time 结束时间
 */
export const formatTimeToRule = time => {
	if (!time || !isNumber(time)) {
		return;
	}
	const endTime = time; // 结束时间
	const curTime = +new Date(); // 当前时间
	const msec = endTime - curTime;
	if (msec > 0) {
		const day = Math.floor(msec / 1000 / 60 / 60 / 24);
		const hour = Math.floor((msec / 1000 / 60 / 60) % 24);
		const minute = Math.floor((msec / 1000 / 60) % 60);
		const second = Math.floor((msec / 1000) % 60);
		let result = "";
		result = `${dateCompletion(day)}天${dateCompletion(hour)}时${dateCompletion(
			minute
		)}分${dateCompletion(second)}`;
		return {
			result,
			day,
			hour,
			minute,
			second
		};
	}
	return;
};

/**
 * @param _key 缓存key
 * @param val 缓存value
 * @returns 缓存值
 */
export function storageToday(_key, val?) {
	// 今天是否已经存储过
	const today = dayjs().format("yyyy-MM-dd");
	const key = `${_key}.${today}`;
	if (val === undefined) {
		return my.getStorageSync({
			key
		}).data;
	}

	my.setStorage({
		key,
		data: val
	});
}

/**
 * 修复taro引用lodash函数报错问题函数
 */
export function fixTaroLodash() {
	const obj = {
		Array: Array,
		Date: Date,
		Error: Error,
		Function: Function,
		Math: Math,
		Object: Object,
		RegExp: RegExp,
		String: String,
		TypeError: TypeError,
		setTimeout: setTimeout,
		clearTimeout: clearTimeout,
		setInterval: setInterval,
		clearInterval: clearInterval
	};

	Object.assign(global, obj);

	if (typeof window === "object" && typeof window.global === "object") {
		Object.assign(window.global, obj);
	}
}

/**
 * @name query中的string转换成对象
 * @param str string
 * @returns
 */
export function queryStringToObj(str): any {
	const newStr = decodeURIComponent(str);
	const obj = {};
	const pairs = newStr.split("&");
	for (let i = 0; i < pairs.length; i++) {
		const pair = pairs[i].split("=");
		obj[pair[0]] = decodeURIComponent(pair[1]);
	}
	return obj;
}

/**
 * @name 渠道来源处理
 */

export function handleSource() {
	// 渠道获取
	my.call("getStartupParams", res => {
		const fn = source => {
			const app = getApp();
			app.AppQuery.source = source;
			track({
				bid: "source",
				eventName: "用户来源",
				extParams: {
					source: JSON.stringify({ source })
				}
			});
		};
		if (res.query) {
			const query = queryStringToObj(res.query);
			if (query?.source) {
				fn(query.source);
			}
		} else if (res.chInfo) {
			fn(res.chInfo);
		} else {
			fn(my.getLaunchOptionsSync().scene);
		}
	});
}

export function formatCountDown(second) {
	// 计算分钟和秒
	let minutes: number | string = Math.floor(second / 60);
	let remainingSeconds: number | string = second % 60;

	// 将单个数字转换为双位数字，例如，7变为07
	minutes = minutes.toString().padStart(2, "0");
	remainingSeconds = remainingSeconds.toString().padStart(2, "0");

	// 返回格式化的时间字符串
	return minutes + ":" + remainingSeconds;
}

// 能否使用Lottie
export const CANIUSE_LOTTIE = my.canIUse("lottie") && !my.isIDE;

/**
 * @name 获取渠道
 * @returns {Promise<String>}
 */
export function getSource() {
	// 渠道获取
	return new Promise<string>(resolve => {
		my.call("getStartupParams", res => {
			if (res.query) {
				const query = queryStringToObj(res.query);
				if (query?.source) {
					resolve(query.source);
				}
			} else if (res.chInfo) {
				resolve(res.chInfo);
			} else {
				resolve("");
			}
		});
	});
}

// clickTime: 点击卡包的时间 receiveTime领取优惠券的时间
export const setVoucherRed = params => {
	my.getStorage({
		key: "My_Voucher_Red",
		success: respData => {
			const { data } = respData || {};
			my.setStorage({
				key: "My_Voucher_Red",
				data: {
					...(data || {}),
					...params
				}
			});
		}
	});
};

// 判断是否显示优惠券红点和我的页面红点
export const getVoucherRed = () => {
	return new Promise<boolean>(resolve => {
		my.getStorage({
			key: "My_Voucher_Red",
			success: resp => {
				const { data } = resp || {};
				const { receiveTime, clickTime = 0 } = data || {};
				const dateFormat = dayjs(receiveTime).format("YYYY-MM-DD");
				const curDate = dayjs(new Date()).format("YYYY-MM-DD");

				// 当日每次领取过 并且 未点击过我的券包 显示红点
				if (
					!!receiveTime &&
					dateFormat === curDate &&
					clickTime < receiveTime
				) {
					resolve && resolve(true);
				} else {
					resolve && resolve(false);
				}
			},
			fail: () => {
				resolve && resolve(false);
			}
		});
	});
};
