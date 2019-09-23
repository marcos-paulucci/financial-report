import app from "./app";

const server = app.listen(app.get("port"), () => {
    console.log(
        "  Server running on http://localhost:%d",
        app.get("port")
    );
    console.log("  Press CTRL-C to stop\n");
});

export default server;
