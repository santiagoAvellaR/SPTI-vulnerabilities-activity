const express = require('express');
const compression = require('compression');
const path = require('path');
const { createRequestHandler } = require('@remix-run/express');

const app = express();
app.use(compression());

// Servir archivos estáticos
app.use("/build", express.static(path.join(__dirname, "public/build"), {
  immutable: true,
  maxAge: "1y"
}));

app.use(express.static("public", { maxAge: "1h" }));

// Todas las demás solicitudes son manejadas por Remix
app.all(
  "*",
  (req, res, next) => {
    try {
      return createRequestHandler({
        build: require("./build"),
        getLoadContext: () => ({})
      })(req, res, next);
    } catch (error) {
      console.error("Error handling request:", error);
      res.status(500).send("Server Error: " + error.message);
    }
  }
);

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});