import { Hono } from "hono";
import { env } from "hono/adapter";
import { nanoid, customAlphabet } from "nanoid";
import { readdir, unlink } from "node:fs/promises";

// utils
import { handleError, res } from "../util/response";
import { filesDir } from "../util/files";

// config
import { domain } from "../config";

const fileRoutes = new Hono();

// list all files
fileRoutes.get("/", async (c) => {
	const name = c.req.param("name");
	// read all the files in the current directory, recursively
	const files = await readdir(filesDir, { recursive: true });

	let list = [];
	files.forEach((file) => {
		let object = Bun.file(`${filesDir}/${file}`);
		let url = `${domain}/files/${file}`;
		list.push({
			name: file,
			size: object.size,
			type: object.type,
			links: {
				file: url,
				playwright: `https://trace.playwright.dev/?trace=${url}`,
			},
		});
	});
	return res(c, { objects: list });
});

// get a single file
fileRoutes.get("/:key", async (c) => {
	const name = c.req.param("key");
	let object = Bun.file(`${filesDir}/${name}`);
	let url = `${domain}/files/${name}`;
	return res(c, {
		name: name,
		size: object.size,
		type: object.type,
		links: {
			file: url,
			playwright: `https://trace.playwright.dev/?trace=${url}`,
		},
	});
});

// upload a file
fileRoutes.put("/upload", async (c) => {
	const body = await c.req.parseBody();
	let key = nanoid();
	const nolookalikesSafe = customAlphabet(
		"6789BCDFGHJKLMNPQRTWbcdfghjkmnpqrtwz",
		12
	);
	let name = nolookalikesSafe();
	let object = await Bun.write(`${filesDir}/${name}.zip`, body.file);
	let url = `${domain}/files/${name}`;
	return res(c, {
		name: `${name}.zip`,
		size: object.size,
		type: object.type,
		links: {
			file: url,
			playwright: `https://trace.playwright.dev/?trace=${url}`,
		},
	});
});

// delete a file
fileRoutes.post("/delete/:name", async (c) => {
	const name = c.req.param("name");
	let result = await unlink(`${filesDir}/${name}`);
	return res(c, { ...result });
});

export default fileRoutes;
