import * as anchor from "@coral-xyz/anchor";
import { PROGRAM } from "./constants";
import { Connection, Keypair, PublicKey, Transaction } from "@solana/web3.js";

export async function initialize(
    connection: Connection,
    payer: Keypair,
    mapping: PublicKey
) {
    const inst = await PROGRAM.methods
        .initialize()
        .accounts({
            mapping,
            signer: payer.publicKey,
            systemProgram: anchor.web3.SystemProgram.programId,
        })
        .instruction();

    const transaction = new Transaction().add(inst);
    return connection.sendTransaction(transaction, [payer], {
        skipPreflight: true,
    });
}