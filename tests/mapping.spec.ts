import { PublicKey, Keypair, Connection } from "@solana/web3.js";

import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

import * as services from "../services";
import { BN } from "bn.js";

const PROGRAM_ID = services.PROGRAM_ID;

describe("Mapping Program", () => {
  let connection = services.CONNECTION;
  const key = Keypair.generate();
  let defaultAccount: Keypair;
  const mappingAddress = services.getMappingAddress(PROGRAM_ID);

  before(async () => {
    const walletPath = path.join(os.homedir(), '.config', 'solana', 'id.json');
    const savedKey = JSON.parse(fs.readFileSync(walletPath, 'utf-8'));
    defaultAccount = Keypair.fromSecretKey(new Uint8Array(savedKey));
    console.log("Default account public key:", defaultAccount.publicKey.toBase58());
  })

  // it("Initialize mapping", async () => {

  //   console.log("Mapping address:", mappingAddress.toBase58());
  //   const tx = await services.initialize(
  //     connection,
  //     defaultAccount,
  //     mappingAddress
  //   );
  //   console.log("Transaction signature:", tx);

  //   console.log("Mapping account initialized successfully.");
  // });

  it("Update mapping", async () => {
    const value = 42; // Example value, replace with actual BN value if needed
    const tx = await services.update(
      connection,
      defaultAccount,
      mappingAddress,
      key.publicKey,
      new BN(value) // Ensure value is a BN instance
    );
    console.log("Transaction signature:", tx);
    const accountInfo = await connection.getAccountInfo(mappingAddress);
    if (accountInfo === null) {
      throw new Error("Mapping account not found");
    }
    console.log("Mapping account updated successfully.");

  });
});
