import { getPostgresConnectionInfo } from "./db-common";

async function main() {
  const info = await getPostgresConnectionInfo();

  console.log("[db:connect] Verbindungsdaten fuer Desktop-Tools");
  console.log("");
  console.log("URI:");
  console.log(info.uri);
  console.log("");
  console.log("Host:", info.host);
  console.log("Port:", info.port);
  console.log("Database:", info.database);
  console.log("User:", info.user);
  console.log("SSL Mode:", info.sslMode);
}

main().catch((error) => {
  console.error("[db:connect] Fehler:", error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
