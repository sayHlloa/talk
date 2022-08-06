// 注册和登录的通用代码

class FieldValidator {
	/**
	 * @param {String} txtId input文本框的ID
	 * @param {Function} validatorFun 是一个验证函数，判断文本框的值是否满足条件，不满足返回错误消息
	 */
	constructor(txtId, validatorFun) {
		this.input = $("#" + txtId); // 文本框的dom元素
		this.p = this.input.nextElementSibling;
		this.validatorFun = validatorFun;
		// 文本框失去焦点需要认证
		this.input.onblur = () => {
			this.validate(); //失去焦点调用验证函数
		};
	}

	/**
	 * 调用函数，进行验证，成功返回true，失败返回false
	 */
	async validate() {
		const err = await this.validatorFun(this.input.value);
		if (err) {
			this.p.innerText = err;
			return false;
		} else {
			this.p.innerText = "";
			return true;
		}
	}

	// 传入所有的input验证器，进行统一验证，所有的验证通过返回true，否则返回false
	static async validate(...validators) {
		const pros = validators.map((v) => v.validate());
		const result = await Promise.all(pros);
		return result.every((r) => r);
	}
}
