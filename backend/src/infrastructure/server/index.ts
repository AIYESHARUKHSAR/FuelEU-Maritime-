import express from "express";
import dotenv from "dotenv";

// Load env first
dotenv.config();

// Create Express app
const app = express();
app.use(express.json());

// Import Routers (keep paths exactly as below)
import routesRouter from "../../adapters/inbound/http/routesRouter";
import complianceRouter from "../../adapters/inbound/http/complianceRouter";
import bankingRouter from "../../adapters/inbound/http/bankingRouter";
import poolsRouter from "../../adapters/inbound/http/poolsRouter";

// Health check
app.get("/health", (_req, res) => res.json({ status: "OK" }));

// Mount Routers
app.use("/api/routes", routesRouter);
app.use("/api/compliance", complianceRouter);
app.use("/api/banking", bankingRouter);
app.use("/api/pools", poolsRouter);

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
