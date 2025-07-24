import { AnchorProvider, Program, Wallet } from "@coral-xyz/anchor";
import { clusterApiUrl, Connection, Keypair, PublicKey } from "@solana/web3.js";
import { MyProgram, IDL } from "../target/types/my_program";

export const PROGRAM_ID = new PublicKey("HFmqgTGsGExc9maUy5VdVyf56dJCjw4NffhQeu3QVRRS")
export const CONNECTION: Connection = new Connection("http://127.0.0.1:8899", "confirmed");

export const PROGRAM = new Program(IDL, PROGRAM_ID, new AnchorProvider(
    CONNECTION,
    new Wallet(Keypair.generate()),
    {}
)) as Program<MyProgram>;