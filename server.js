const express = require('express');
const compression = require('compression');
const path = require('path');
const fs = require('fs');
const { createRequestHandler } = require('@remix-run/express');

const app = express();
app.use(compression());

// Función para encontrar y cargar el módulo build
function loadBuildModule() {
  console.log("Current directory:", __dirname);
  console.log("Directory contents:", fs.readdirSync(__dirname));
  
  // Lista de posibles ubicaciones para el build
  const possiblePaths = [
    path.join(__dirname, './build'),
    path.join(__dirname, './build/server'),
    path.join(__dirname, './build/server/index.js'),
    path.join(__dirname, '../build'),
    path.join(__dirname, 'build')
  ];
  
  console.log("Checking possible build paths:");
  for (const buildPath of possiblePaths) {
    try {
      if (fs.existsSync(buildPath)) {
        console.log(`Found build at: ${buildPath}`);
        
        // Para directorios, intentamos cargar index.js o el directorio mismo
        if (fs.lstatSync(buildPath).isDirectory()) {
          const indexPath = path.join(buildPath, 'index.js');
          if (fs.existsSync(indexPath)) {
            console.log(`Loading index.js from ${buildPath}`);
            return require(buildPath);
          }
          console.log(`Loading directory ${buildPath}`);
          return require(buildPath);
        }
        
        // Para archivos, intentamos cargar directamente
        return require(buildPath);
      }
    } catch (err) {
      console.log(`Error checking ${buildPath}:`, err.message);
    }
  }
  
  // Si no se encuentra en ninguna ubicación estándar, buscamos recursivamente
  console.log("Build not found in standard locations, searching recursively...");
  
  // Función para buscar el build recursivamente
  function findBuildRecursively(dir, depth = 0) {
    if (depth > 3) return null; // Limitar profundidad para evitar búsquedas extensas
    
    try {
      const files = fs.readdirSync(dir);
      
      if (files.includes("build")) {
        const buildPath = path.join(dir, "build");
        if (fs.statSync(buildPath).isDirectory()) {
          console.log(`Found build directory at ${buildPath}`);
          return buildPath;
        }
      }
      
      // Buscar en subdirectorios
      for (const file of files) {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory() && 
            file !== "node_modules" && 
            file !== ".git") {
          const result = findBuildRecursively(filePath, depth + 1);
          if (result) return result;
        }
      }
    } catch (err) {
      console.log(`Error searching in ${dir}:`, err.message);
    }
    
    return null;
  }
  
  const buildPath = findBuildRecursively(__dirname);
  if (buildPath) {
    try {
      console.log(`Loading recursively found build from ${buildPath}`);
      return require(buildPath);
    } catch (err) {
      console.error(`Failed to load recursively found build:`, err.message);
    }
  }
  
  // Si todavía no encontramos el build, lanzamos un error informativo
  throw new Error(`Build module not found after checking multiple locations.
    Current directory: ${__dirname}
    Tried paths: ${possiblePaths.join(', ')}
  `);
}

// Servir archivos estáticos
app.use("/build", express.static(path.join(__dirname, "public/build"), {
  immutable: true,
  maxAge: "1y"
}));

app.use(express.static("public", { maxAge: "1h" }));

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).send(`
    <html>
      <head><title>Server Error</title></head>
      <body>
        <h1>Server Error</h1>
        <p>${err.message}</p>
        <p>Check the server logs for more details.</p>
      </body>
    </html>
  `);
});

// Cargar el módulo build de manera segura
let buildModule;
try {
  console.log("Attempting to load build module...");
  buildModule = loadBuildModule();
  console.log("Build module loaded successfully");
} catch (error) {
  console.error("Failed to load build module:", error);
  // No asignamos buildModule, lo manejaremos en las rutas
}

// Ruta para verificar el estado del servidor
app.get('/server-status', (req, res) => {
  res.json({
    status: 'running',
    buildLoaded: !!buildModule,
    directory: __dirname,
    env: process.env.NODE_ENV
  });
});

// Todas las demás solicitudes son manejadas por Remix
app.all("*", (req, res) => {
  if (!buildModule) {
    return res.status(500).send(`
      <html>
        <head><title>Server Configuration Error</title></head>
        <body>
          <h1>Server Configuration Error</h1>
          <p>The server could not load the Remix build module.</p>
          <p>This is likely a deployment configuration issue.</p>
          <p>Check the server logs for more details.</p>
        </body>
      </html>
    `);
  }
  
  try {
    return createRequestHandler({
      build: buildModule,
      getLoadContext: () => ({})
    })(req, res);
  } catch (error) { 
    console.error("Error handling request:", error);
    res.status(500).send(`
      <html>
        <head><title>Server Error</title></head>
        <body>
          <h1>Server Error</h1>
          <p>Error handling request: ${error.message}</p>
          <p>Check the server logs for more details.</p>
        </body>
      </html>
    `);
  }
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode`);
});