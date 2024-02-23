class TraceFileUploader {
	constructor(domain = "") {
		this.root = this;
		this._url = `${domain}/api`;
	}
	async files(key) {
		let url = `${this._url}/files`;
		if (key != null) url = `${this._url}/files/${key}`;
		let res = await this.get(url);
		return res;
	}
	async upload(files) {
		const x = this;
		const filesArray = Array.from(files);
		const promises = filesArray.map((file) =>
			x.put(`${this._url}/files/upload`, file)
		);
		const results = await Promise.all(promises);
		return results;
	}
	async deleteFile(key) {
		let res = await this.post(`${this._url}/files/delete/${key}`);
		return res;
	}

	// utility functions
	async post(url, data = {}) {
		let x = this;
		const res = await fetch(url, {
			method: "POST", // or 'PUT'
			headers: {
				Authorization: this.token,
			},
			body: JSON.stringify(data),
		});
		return res.json();
	}

	async get(url) {
		let x = this;
		const res = await fetch(url, {
			headers: {
				Authorization: x.token,
			},
		});
		return res.json();
	}

	async put(url, file) {
		const formData = new FormData();
		formData.append("file", file);

		const res = await fetch(url, {
			method: "PUT",
			headers: {
				Authorization: this.token,
			},
			body: formData,
		});
		return res.json();
	}
}
