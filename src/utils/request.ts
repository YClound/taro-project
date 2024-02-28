import cst from "@/utils/constant";
import { genRandomStr, showErrorNotify } from "@/utils";

interface RequestArgs {
	path?: string;
	data?: any;
	headers?: {
		[key: string]: any;
	};
	method?:
		| "OPTIONS"
		| "GET"
		| "HEAD"
		| "POST"
		| "PUT"
		| "DELETE"
		| "TRACE"
		| "CONNECT";
	[key: string]: any;
}
interface ResponseData<T> {
	code: number;
	success: boolean;
	msg: string;
	data: T;
}

let user = {
	platform: "",
	uid: "",
	userId: "",
};
export function setUser(_user) {
	return (user = _user);
}
export function getUser() {
	return user;
}
let Token = "";
export function getToken() {
	return Token;
}
// 请求队列
const requestQueue: {
	trigger: () => void; // 触发请求
	req: Promise<any>;
}[] = [];
// 清空并触发请求队列
const triggerRequestQueue = () => {
	while (requestQueue.length) {
		requestQueue.shift()!.trigger();
	}
};
/**
 * 原生请求方法
 */
export const nativeRequest = my.request || my.httpRequest;

/**
 * 获取授权
 */
export function auth(): Promise<string> {
	return new Promise((resolve, reject) => {
		my.getAuthCode({
			scopes: "auth_base",
			fail: reject,
			success({ authCode }) {
				const data = {
					authCode,
					source: cst.APP_KEY,
				};

				nativeRequest({
					url: cst.URL + "/alipay/auth",
					method: "POST",
					headers: {
						"Content-Type": "application/x-www-form-urlencoded",
						// "X-B3-TraceId": genRandomStr(32),
					},
					data,
					success(res) {
						const result = res.data;

						if (result && result.data && result.data.user) {
							setUser(result.data.user);
						}

						if (result && result.data && result.data.token) {
							resolve(result.data.token);
							setUser(result.data.user);
						} else {
							reject(res);
						}
					},
					fail: reject,
				});
			},
		});
	});
}
const systemInfo = my.getSystemInfoSync();
/**
 * 请求方法封装
 */
export function request<T>({
	path = "",
	headers = {
		"Content-Type": "application/x-www-form-urlencoded",
	},
	method = "POST",
	data,
	...args
}: RequestArgs): Promise<ResponseData<T>> {
	return new Promise((resolve, reject) => {
		const failCallback = (e) => {
			const errorMessage = e && e.msg ? e.msg : "请求错误";
			showErrorNotify(errorMessage);
			if (reject) {
				reject({
					e,
				});
			}
		};
		const successCallback = (res) => {
			const result = res.data;

			result && result.success ? resolve(result) : failCallback(result);
		};
		const params = {
			headers: {
				// "X-B3-TraceId": genRandomStr(32),
				...headers,
			},
			data: typeof data === "function" ? data() : data,
			method,
			url: cst.URL + path,
			success: successCallback,
			fail: failCallback,
			...args,
		};

		if (Token) params.headers["token"] = Token;

		my.request(params);
	});
}

export default function <T = any>(args: RequestArgs): Promise<ResponseData<T>> {
	const requestItem = {
		trigger() {},
		req: new Promise(() => {}),
	};

	requestItem.req = new Promise(
		(resolve) => (requestItem.trigger = () => resolve(request<T>(args)))
	);
	requestQueue.push(requestItem);

	if (Token) {
		// 直接触发请求
		triggerRequestQueue();
	} else if (requestQueue.length === 1) {
		auth().then(
			(token) => {
				Token = token;
				triggerRequestQueue();
			},
			() => {}
		);
	}

	return requestItem.req as Promise<ResponseData<T>>;
}
