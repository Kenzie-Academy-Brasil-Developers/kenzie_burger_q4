import { createConnection } from "typeorm";

function connection() {
  return createConnection();
}

export default connection;
