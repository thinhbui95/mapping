use anchor_lang::prelude::*;
use anchor_lang::solana_program::system_instruction;
use anchor_lang::solana_program::program::invoke;


declare_id!("HFmqgTGsGExc9maUy5VdVyf56dJCjw4NffhQeu3QVRRS");
#[program]
pub mod my_program {
    use super::*;

    pub fn initialize(_ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }

    pub fn update(ctx: Context<Update>, key: Pubkey, value: u64) -> Result<()> {
        let mapping_account = &mut ctx.accounts.mapping;
        if let Some(entry) = mapping_account.data.iter_mut().find(|entry| entry.key == key) {
            entry.value = value;
        } else {
            require!(mapping_account.total < 100, ErrorCode::AmountExceeded);
            mapping_account.data.push(MappingEntry {
                key,
                value,
            });
            mapping_account.total += 1;

            let rent = Rent::get()?;
            let new_size = MappingAccount::size(mapping_account.data.len()) + 8;
            let current_lamports = mapping_account.to_account_info().lamports();
            let required_lamports = rent.minimum_balance(new_size);

            if current_lamports < required_lamports {
                let additional_lamports = required_lamports - current_lamports;
                // Transfer lamports from signer to mapping_account
                invoke(
                    &system_instruction::transfer(
                        ctx.accounts.signer.key,
                        mapping_account.to_account_info().key,
                        additional_lamports,
                    ),
                    &[
                        ctx.accounts.signer.to_account_info(),
                        mapping_account.to_account_info(),
                        ctx.accounts.system_program.to_account_info(),
                    ],
                )?;
            }
            msg!("Adding new entry with key: {:?}", key);
            mapping_account.to_account_info().realloc(new_size, false)?;
        }
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init, 
        payer = signer, 
        space = MappingAccount::size(0) + 8,
        seeds = [b"mapping_account"],
        bump,
    )]
    pub mapping: Account<'info, MappingAccount>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Update<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
    #[account(
        mut,
        seeds = [b"mapping_account"],
        bump,
    )]
    pub mapping: Account<'info, MappingAccount>,
}
 


#[account]
pub struct MappingAccount {
    pub data: Vec<MappingEntry>, // Vector of MappingEntry
    pub total: u64,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Default)]
pub struct MappingEntry {
    pub key: Pubkey,
    pub value: u64,
}

impl MappingAccount {
    pub fn size(number_of_entries: usize) -> usize {
        8 + (32 + 8) * number_of_entries + 8 // 8 for total, 32 for Pubkey, 8 for u64
    }
}

#[error_code]
pub enum ErrorCode {
    #[msg("Amount is exceeded")]
    AmountExceeded,
}
