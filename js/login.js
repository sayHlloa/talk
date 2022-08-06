const loginIdValidator = new FieldValidator("txtLoginId", async function (val) {
	if (!val) {
		return "账号不能为空";
	}
});

const loginPwdValidator = new FieldValidator("txtLoginPwd", async function (val) {
	if (!val) {
		return "请填写密码";
	}
});

const form = $(".user-form");
form.onsubmit = async function (e) {
	e.preventDefault(); // 阻止表单默认行为
	// 提交表单统一验证
	const result = await FieldValidator.validate(loginIdValidator, loginPwdValidator);
	if (!result) {
		return false;
	}

	// 浏览器提供的一个构造函数，里面传入表单dom，得到一个表单"对象"数据
	const formData = new FormData(form);
	// obj 表示将一个数组（第一项是键，第二项是指）转换成一个对象
	const data = Object.fromEntries(formData.entries());
	const resp = await API.login(data);

	if (resp.code === 0) {
		alert("登录成功，点击跳转到登录主页");
		location.href = "index.html";
	} else {
		loginIdValidator.p.innerText = "账号或密码错误";
		loginPwdValidator.input.innerText = "";
	}
};
