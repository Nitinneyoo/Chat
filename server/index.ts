import app from "./app";

Bun.serve({
	development: true,
	fetch: app.fetch,
});

console.log("Server Started");
