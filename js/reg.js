// 账号验证
const loginIdValidator = new FieldValidator("txtLoginId", async function (val) {
	if (!val) {
		return "账号不能为空";
	}
	const resp = await API.exists(val);
	if (resp.data) {
		return "账号已存在";
	}
});

// 昵称验证
const nickNameValidator = new FieldValidator("txtNickname", function (val) {
	if (!val) {
		return "请输入昵称";
	}
});

// 密码验证
const txtLoginPwdValidator = new FieldValidator("txtLoginPwd", function (val) {
	if (!val) {
		return "请输入密码";
	}
});

// 确认密码验证
const txtLoginPwdConfirmValidator = new FieldValidator("txtLoginPwdConfirm", function (val) {
	if (!val) {
		return "请输入确认密码";
	}
	if (txtLoginPwdValidator.input.value !== val) {
		return "两次密码输入不一致";
	}
});

// 表单注册事件
const form = $(".user-form");
form.onsubmit = async function (e) {
	e.preventDefault(); // 阻止表单默认行为
	// 提交表单统一验证
	const result = await FieldValidator.validate(loginIdValidator, nickNameValidator, txtLoginPwdValidator, txtLoginPwdConfirmValidator);
	if (!result) {
		return false;
	}
	// const resp = await API.reg({
	// 	loginId: loginIdValidator.input.value,
	// 	nickname: nickNameValidator.input.value,
	// 	loginPwd: txtLoginPwdValidator.input.value,
	// });

	// 浏览器提供的一个构造函数，里面传入表单dom，得到一个表单"对象"数据
	const formData = new FormData(form);
	// obj 表示将一个数组（第一项是键，第二项是指）转换成一个对象
	const data = Object.fromEntries(formData.entries());
	const resp = await API.reg(data);
	console.log(resp);

	if (resp.code === 0) {
		alert("注册成功，点击跳转到登录主页");
		location.href = "login.html";
	}
};
