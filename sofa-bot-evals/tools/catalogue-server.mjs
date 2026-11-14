// The store's catalogue and stock, served to Pip as two tools over MCP (stdio, JSON-RPC).
// Pip never sees the catalogue in its prompt; it looks sofas up when it needs them.
import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const catalogue = JSON.parse(fs.readFileSync(path.join(root, "data/catalogue.json"), "utf8"));

const record = p => ({
  id: p.id, name: p.name, type: p.type, seats: p.seats,
  size_cm: { width: p.width_cm, depth: p.depth_cm, height: p.height_cm }, ...(p.bed_size ? { bed_size: p.bed_size } : {}),
  material: p.material, colour: p.colour, price_eur: p.price_eur,
  washable_covers: p.washable_covers, pet_friendly: p.pet_friendly, ok_for_damp_rooms: p.damp_ok,
  in_stock: p.in_stock, description: p.note,
});

export const TOOLS = [
  {
    name: "search_catalogue",
    description: "Search Plank & Pillow's live sofa catalogue and current stock. Every filter is optional; combine as many as the customer's needs allow. Returns matching sofas sorted by price, with size, material, colour, price, washable covers, pet-friendly, OK for damp rooms, stock status and the product description.",
    inputSchema: {
      type: "object",
      properties: {
        max_width_cm: { type: "number", description: "Widest the sofa can be, in cm." },
        min_width_cm: { type: "number", description: "Narrowest the sofa can be, in cm." },
        max_depth_cm: { type: "number", description: "Deepest the sofa can be, in cm." },
        max_price_eur: { type: "number", description: "Highest price, in euros." },
        seats: { type: "array", items: { type: "number" }, description: "Acceptable seat counts, e.g. [2, 2.5]." },
        type: { type: "string", enum: ["sofa", "corner sofa", "sofa bed", "loveseat", "chaise sofa"] },
        material: { type: "string", description: "Words to match in the material, e.g. 'leather' or 'performance weave'." },
        colour: { type: "string", description: "Words to match in the colour, e.g. 'grey' or 'green'." },
        pet_friendly: { type: "boolean" },
        washable_covers: { type: "boolean" },
        ok_for_damp_rooms: { type: "boolean" },
        in_stock_only: { type: "boolean", description: "Only return sofas that are in stock now. Defaults to false." },
      },
    },
  },
  {
    name: "get_product",
    description: "Look up one sofa by product ID (e.g. PP-101) or by name (e.g. 'Arlo'). Returns every catalogue fact and its current stock status. A name can match more than one size.",
    inputSchema: { type: "object", properties: { id_or_name: { type: "string" } }, required: ["id_or_name"] },
  },
];

const has = (hay, needle) => String(hay).toLowerCase().includes(String(needle).toLowerCase().trim());
export function runTool(name, a = {}) {
  if (name === "search_catalogue") {
    const hits = catalogue.filter(p =>
      (a.max_width_cm == null || p.width_cm <= a.max_width_cm) && (a.min_width_cm == null || p.width_cm >= a.min_width_cm) &&
      (a.max_depth_cm == null || p.depth_cm <= a.max_depth_cm) && (a.max_price_eur == null || p.price_eur <= a.max_price_eur) &&
      (!a.seats?.length || a.seats.includes(p.seats)) && (!a.type || p.type === a.type) &&
      (!a.material || has(p.material, a.material)) && (!a.colour || has(p.colour, a.colour)) &&
      (a.pet_friendly == null || p.pet_friendly === a.pet_friendly) && (a.washable_covers == null || p.washable_covers === a.washable_covers) &&
      (a.ok_for_damp_rooms == null || p.damp_ok === a.ok_for_damp_rooms) && (!a.in_stock_only || p.in_stock)
    ).sort((x, y) => x.price_eur - y.price_eur);
    return { results: hits.length, sofas: hits.map(record) };
  }
  if (name === "get_product") {
    const q = String(a.id_or_name || "");
    const hits = catalogue.filter(p => p.id.toLowerCase() === q.toLowerCase().trim() || has(p.name, q));
    return hits.length ? { sofas: hits.map(record) } : { sofas: [], message: `No sofa called "${q}" in the catalogue.` };
  }
  throw new Error(`Unknown tool ${name}`);
}

// stdio MCP server, only when run directly
if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const send = m => process.stdout.write(JSON.stringify(m) + "\n");
  readline.createInterface({ input: process.stdin }).on("line", line => {
    let m; try { m = JSON.parse(line); } catch { return; }
    if (m.id === undefined) return;
    try {
      if (m.method === "initialize") return send({ jsonrpc: "2.0", id: m.id, result: {
        protocolVersion: m.params?.protocolVersion || "2025-06-18", capabilities: { tools: {} }, serverInfo: { name: "catalogue", version: "1.0.0" } } });
      if (m.method === "tools/list") return send({ jsonrpc: "2.0", id: m.id, result: { tools: TOOLS } });
      if (m.method === "tools/call") {
        const out = runTool(m.params.name, m.params.arguments);
        return send({ jsonrpc: "2.0", id: m.id, result: { content: [{ type: "text", text: JSON.stringify(out) }] } });
      }
      if (m.method === "ping") return send({ jsonrpc: "2.0", id: m.id, result: {} });
      send({ jsonrpc: "2.0", id: m.id, error: { code: -32601, message: "Method not found" } });
    } catch (e) {
      send({ jsonrpc: "2.0", id: m.id, result: { isError: true, content: [{ type: "text", text: String(e.message || e) }] } });
    }
  });
}
