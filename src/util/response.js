export const throwErr = (c, msg) => {
	console.error(msg);
	return c.json(
		{
			success: false,
			msg,
		},
		500
	);
};

export const handleError = (err, c) => {
	console.error(err);
	return c.json(
		{
			success: false,
			msg: `${err}`,
		},
		500
	);
};
export const res = (c, obj) => c.json({ success: true, ...obj });
