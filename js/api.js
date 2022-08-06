const API = (function () {
	const BASE_URL = "https://study.duyiedu.com";
	const TOKEN_KEY = "token";

	function get(path) {
		const headers = {};
		const token = localStorage.getItem([TOKEN_KEY]); // 取出令牌并判断
		if (token) {
			headers.authorization = `Bearer ${token}`;
		}
		return fetch(BASE_URL + path, { headers });
	}

	function post(path, bodyObj) {
		const headers = {
			"Content-Type": "application/json",
		};
		const token = localStorage.getItem([TOKEN_KEY]); // 取出令牌并判断
		if (token) {
			headers.authorization = `Bearer ${token}`;
		}
		return fetch(BASE_URL + path, { headers, method: "POST", body: JSON.stringify(bodyObj) });
	}

	/**
	 * 用户注册
	 * @param {obj} userInfo 是一个注册用户信息对象
	 */
	async function reg(userInfo) {
		const resp = await post("/api/user/reg", userInfo); //fetch函数封装
		return await resp.json();
	}

	/**
	 * 用户登录
	 * @param {obj} logInfo
	 */
	async function login(logInfo) {
		const resp = await post("/api/user/login", logInfo);

		const result = await resp.json();
		if (result.code === 0) {
			const token = resp.headers.get("authorization"); // 登陆成功，得到令牌
			localStorage.setItem([TOKEN_KEY], token); // 存放在localStorage里面（浏览器缓存）
		}
		return result;
	}

	/**
	 * 判断用户名是否已存在
	 * @param {string} loginId
	 */
	async function exists(loginId) {
		const resp = await get("/api/user/exists?loginId=" + loginId); // get请求的参数写在URL里面
		return await resp.json();
	}

	/**
	 * 返回 当前登录的用户信息
	 */
	async function profile() {
		const resp = await get("/api/user/profile");
		return resp.json();
	}

	/**
	 * @param {string} content 发送聊天消息
	 */
	async function sendChat(content) {
		const resp = await post("/api/chat", { content });
		return await resp.json();
	}

	/**
	 * 获取聊天消息
	 */
	async function getHistory() {
		const resp = await get("/api/chat/history");
		return await resp.json();
	}

	function loginOut() {
		localStorage.removeItem(TOKEN_KEY);
	}

	return {
		reg,
		login,
		exists,
		profile,
		sendChat,
		getHistory,
		loginOut,
	};
})();
