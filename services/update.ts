import * as anchor from "@coral-xyz/anchor";
import { PROGRAM } from "./constants";
import { Connection, Keypair, PublicKey, Transaction } from "@solana/web3.js";
import { BN } from "@coral-xyz/anchor";

export async function update(
    connection: Connection,
    payer: Keypair,
    mapping: PublicKey,
    key: PublicKey,
    value: BN
) {
    const inst = await PROGRAM.methods
        .update(key, value)
        .accounts({
            signer: payer.publicKey,
            systemProgram: anchor.web3.SystemProgram.programId,
            mapping
        })
        .instruction();

    const transaction = new Transaction().add(inst);
    return connection.sendTransaction(transaction, [payer], {
        skipPreflight: true,
    });
}