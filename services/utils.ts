import { PublicKey } from "@solana/web3.js";
export function getMappingAddress(
    programID: PublicKey,
): PublicKey {
    return PublicKey.findProgramAddressSync(
        [Buffer.from("mapping_account")],
        programID,
    )[0];
}