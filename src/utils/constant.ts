// 常量
// import { genSessionId } from '@/public/util';
const accountInfo = my.getAccountInfoSync ? my.getAccountInfoSync() : {};
const { miniProgram = {} } = accountInfo || {};

function genRandomStr(hashLength) {
	if (!hashLength || typeof Number(hashLength) !== "number") return "";
	const ar = "1234567890abcdefghijklmnopqrstuvwxyz";
	const hs: string[] = [];
	const hl = Number(hashLength);
	const al = ar.length;

	for (let i = 0; i < hl; i++) {
		hs.push(ar[Math.floor(Math.random() * al)]);
	}

	return hs.join("");
}

const sessionId = +new Date() + genRandomStr(16);

const NODE_ENV =
	process.env.NODE_ENV === "development" ? "development" : "production";

export default {
	URL: process.env.API,
	TRACE_URL: process.env.TRACE_URL,
	EXCEPTURER_URL: process.env.EXCEPTURER_URL,
	TRACE_ENV: NODE_ENV,
	NODE_ENV: NODE_ENV as any,
	APP_ID: "2021004128668403",
	APP_KEY: "ichibankuji",
	TRACK_APP_KEY: 'lucky_bag_lottery',
	SESSION_ID: sessionId,
	projectVersion: miniProgram.version || "v2.4.0", // 每个版本都要改, 埋点侧统计用
	// 接口版本号，后端使用
	clientVersion: "1.0.0",
	APP_TYPE: "app",
	APP_NAME: "福袋赏",
};
