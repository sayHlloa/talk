(async function () {
	// 验证用户是否已登录，如果没有登录，则跳转到登录页
	const data = await API.profile();
	// 登录成功返回一个用户对象，失败返回null
	const user = data.data;
	if (!user) {
		alert("未登录或登录已过期，点击跳转登录页");
		location.href = "login.html";
		return;
	}
	// 后续就是登陆成功要做的事情
	const doms = {
		aside: {
			nickname: $("#nickname"),
			loginId: $("#loginId"),
		},
		chatContainer: $(".chat-container"),
		close: $(".close"),
		txtMsg: $("#txtMsg"),
		msgContainer: $(".msg-container"),
	};
	setUserInfo();
	await getHistory();
	sendChat();

	// 设置 显示侧边栏用户信息
	function setUserInfo() {
		// 注意不能信任用户输入的信息，使用innerText
		doms.aside.nickname.innerText = user.nickname;
		doms.aside.loginId.innerText = user.loginId;
	}

	// 加载历史记录
	async function getHistory() {
		const resp = await API.getHistory();
		for (const item of resp.data) {
			addChat(item);
		}
		scrollBottom();
	}

	// 注销事件
	doms.close.onclick = () => {
		API.loginOut();
		alert("点击返回登录页");
		location.href = "login.html";
	};

	// addChat({
	// 	content: "晚饭吃什么",
	// 	createdAt: 1659171114142,
	// 	from: "cocole",
	// 	to: null,
	// });

	// 传入一个信息对象,在页面上显示
	function addChat(chatInfo) {
		const div = $$$("div");
		div.className = "chat-item";
		if (chatInfo.from) {
			div.classList.add("me");
		}

		const img = document.createElement("img");
		img.className = "chat-avatar";
		img.src = chatInfo.from ? "./asset/avatar.png" : "./asset/robot-avatar.jpg";

		const content = document.createElement("div");
		content.className = "chat-content";
		content.innerText = chatInfo.content;

		const date = document.createElement("div");
		date.className = "chat-date";
		date.innerText = formatDate(chatInfo.createdAt);

		div.appendChild(img);
		div.appendChild(content);
		div.appendChild(date);

		doms.chatContainer.appendChild(div);
	}

	// 传入一个时间戳，返回指定的时间格式
	function formatDate(timestamp) {
		const date = new Date(timestamp);
		const year = date.getFullYear();
		const month = (date.getMonth() + 1).toString().padStart(2, "0"); // 注意，这里月份从0开始，得加1
		const day = date.getDay().toString().padStart(2, "0");
		const hour = date.getHours().toString().padStart(2, "0");
		const minute = date.getMinutes().toString().padStart(2, "0");
		const second = date.getSeconds().toString().padStart(2, "0");

		return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
	}

	// 聊天记录滑动到底部
	function scrollBottom() {
		doms.chatContainer.scrollTop = doms.chatContainer.scrollHeight;
	}

	// 发送聊天消息
	async function sendChat() {
		const content = doms.txtMsg.value.trim();
		if (!content) {
			return;
		}
		// 首先把内容显示到页面上;
		addChat({
			content: content,
			createdAt: Date.now(), // 获取到当前时间搓
			from: user.loginId,
			to: null,
		});
		doms.txtMsg.value = ""; // 文本清空
		scrollBottom();

		const resp = await API.sendChat(content);
		addChat({
			content: resp.data.content,
			createdAt: resp.data.createdAt,
			from: null,
			to: user.loginId,
		});
		scrollBottom();
	}
	window.sendChat = sendChat;

	// 注册发送消息事件
	doms.msgContainer.onsubmit = (e) => {
		e.preventDefault();
		sendChat();
		// console.log(e);
	};
})();
