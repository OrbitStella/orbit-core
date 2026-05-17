#![no_std]
use soroban_sdk::{contract, contractimpl, Address, Env, String};

#[contract]
pub struct TokenContract;

#[contractimpl]
impl TokenContract {
    /// Initialize the token with a name and symbol
    pub fn initialize(env: Env, name: String, symbol: String, admin: Address) {
        env.storage().instance().set(&("name"), &name);
        env.storage().instance().set(&("symbol"), &symbol);
        env.storage().instance().set(&("admin"), &admin);
    }

    /// Get the token name
    pub fn name(env: Env) -> String {
        env.storage().instance().get(&("name")).unwrap()
    }

    /// Get the token symbol
    pub fn symbol(env: Env) -> String {
        env.storage().instance().get(&("symbol")).unwrap()
    }

    /// Get the admin address
    pub fn admin(env: Env) -> Address {
        env.storage().instance().get(&("admin")).unwrap()
    }

    /// Mint tokens to an address (admin only)
    pub fn mint(env: Env, to: Address, amount: i128) {
        let admin = Self::admin(env.clone());
        admin.require_auth();

        let balance: i128 = env.storage().instance().get(&to).unwrap_or(0);
        env.storage().instance().set(&to, &(balance + amount));
    }

    /// Get balance of an address
    pub fn balance(env: Env, address: Address) -> i128 {
        env.storage().instance().get(&address).unwrap_or(0)
    }

    /// Transfer tokens from one address to another
    pub fn transfer(env: Env, from: Address, to: Address, amount: i128) {
        from.require_auth();

        let from_balance: i128 = env.storage().instance().get(&from).unwrap_or(0);
        require!(from_balance >= amount, "Insufficient balance");

        let to_balance: i128 = env.storage().instance().get(&to).unwrap_or(0);

        env.storage().instance().set(&from, &(from_balance - amount));
        env.storage().instance().set(&to, &(to_balance + amount));
    }
}
