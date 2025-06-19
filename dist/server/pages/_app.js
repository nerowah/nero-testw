const CHUNK_PUBLIC_PATH = "server/pages/_app.js";
const runtime = require("../chunks/ssr/[turbopack]_runtime.js");
runtime.loadChunk("server/chunks/ssr/[root-of-the-server]__01c9c3a3._.js");
runtime.getOrInstantiateRuntimeModule("[project]/node_modules/.pnpm/next@15.3.0_@babel+core@7.2_45d0700406082484422f95022a0ce7d0/node_modules/next/app.js [ssr] (ecmascript)", CHUNK_PUBLIC_PATH);
module.exports = runtime.getOrInstantiateRuntimeModule("[project]/node_modules/.pnpm/next@15.3.0_@babel+core@7.2_45d0700406082484422f95022a0ce7d0/node_modules/next/app.js [ssr] (ecmascript)", CHUNK_PUBLIC_PATH).exports;
