// Option 1: Using require syntax
export const PAYOS_CLIENT_ID="45419fcb-eaf9-46d3-a868-95e7d2ad0c3f"
export const PAYOS_API_KEY="27fe63b0-ad07-4635-a0e2-776008c833e0"
export const PAYOS_CHECKSUM_KEY="b55de492e7e27be6fa693b8acf2499b82a97bafb65ef643ef149e5f217d06a31"
export const PAYOS_RETURN_URL = "https://www.messenger.com/e2ee/t/6531991546907385"
export const PAYOS_RETURN_URL_FAIL="https://www.messenger.com/e2ee/t/6531991546907385"

// Option 2: If PayOS.js has a named export
// const { namedExport } = require("../config/PayOS/PayOS.js");
// const payos = new namedExport(global.config.payos.client_id, global.config.payos.api_key, global.config.payos.checksum_key);
// module.exports = payos;
