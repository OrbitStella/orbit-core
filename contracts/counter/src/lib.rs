#![no_std]
use soroban_sdk::{contractimpl, panic_with_error, symbol_short, Address, Env, Symbol};

// Error codes
pub const ERR_NOT_INITIALIZED: u32 = 1;
pub const ERR_ALREADY_INITIALIZED: u32 = 2;
pub const ERR_NO_PERMISSION: u32 = 3;

// Symbol for storage keys
const COUNTER: Symbol = symbol_short!("COUNTER");
const OWNER: Symbol = symbol_short!("OWNER");

pub struct CounterContract;

#[contractimpl]
impl CounterContract {
    /// Initialize the contract with an owner
    pub fn initialize(env: Env, owner: Address) {
        if env.storage().instance().has(&OWNER) {
            panic_with_error!(env, ERR_ALREADY_INITIALIZED);
        }

        env.storage().instance().set(&OWNER, &owner);
        env.storage().instance().set(&COUNTER, &0u32);
    }

    /// Increment the counter by 1
    pub fn increment(env: Env) -> u32 {
        // Check if contract is initialized
        if !env.storage().instance().has(&OWNER) {
            panic_with_error!(env, ERR_NOT_INITIALIZED);
        }

        let mut count: u32 = env.storage().instance().get(&COUNTER).unwrap_or(0);
        count = count.checked_add(1).unwrap_or(0);
        env.storage().instance().set(&COUNTER, &count);
        count
    }

    /// Get the current counter value
    pub fn get(env: Env) -> u32 {
        if !env.storage().instance().has(&OWNER) {
            panic_with_error!(env, ERR_NOT_INITIALIZED);
        }

        env.storage().instance().get(&COUNTER).unwrap_or(0)
    }

    /// Reset the counter to 0 (only owner can do this)
    pub fn reset(env: Env, caller: Address) {
        if !env.storage().instance().has(&OWNER) {
            panic_with_error!(env, ERR_NOT_INITIALIZED);
        }

        let owner: Address = env.storage().instance().get(&OWNER).unwrap();
        if caller != owner {
            panic_with_error!(env, ERR_NO_PERMISSION);
        }

        env.storage().instance().set(&COUNTER, &0u32);
    }

    /// Get the contract owner
    pub fn get_owner(env: Env) -> Address {
        if !env.storage().instance().has(&OWNER) {
            panic_with_error!(env, ERR_NOT_INITIALIZED);
        }

        env.storage().instance().get(&OWNER).unwrap()
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::{Address, Env};

    #[test]
    fn test_counter_full_workflow() {
        let env = Env::default();
        let contract_id = env.register_contract(None, CounterContract);
        let client = CounterContractClient::new(&env, &contract_id);

        // Test initialization
        let owner = Address::generate(&env);
        client.initialize(&owner);

        // Test initial value
        assert_eq!(client.get(), 0);

        // Test increment
        assert_eq!(client.increment(), 1);
        assert_eq!(client.get(), 1);
        assert_eq!(client.increment(), 2);
        assert_eq!(client.get(), 2);

        // Test multiple increments
        assert_eq!(client.increment(), 3);
        assert_eq!(client.increment(), 4);
        assert_eq!(client.get(), 4);

        // Test reset
        client.reset(&owner);
        assert_eq!(client.get(), 0);

        // Test owner
        assert_eq!(client.get_owner(), owner);
    }

    #[test]
    fn test_counter_increment_sequence() {
        let env = Env::default();
        let contract_id = env.register_contract(None, CounterContract);
        let client = CounterContractClient::new(&env, &contract_id);

        let owner = Address::generate(&env);
        client.initialize(&owner);

        // Test increment sequence
        for i in 1..=10 {
            assert_eq!(client.increment(), i);
            assert_eq!(client.get(), i);
        }
    }

    #[test]
    fn test_counter_reset_after_increments() {
        let env = Env::default();
        let contract_id = env.register_contract(None, CounterContract);
        let client = CounterContractClient::new(&env, &contract_id);

        let owner = Address::generate(&env);
        client.initialize(&owner);

        // Increment multiple times
        client.increment();
        client.increment();
        client.increment();
        assert_eq!(client.get(), 3);

        // Reset and verify
        client.reset(&owner);
        assert_eq!(client.get(), 0);

        // Should be able to increment again
        assert_eq!(client.increment(), 1);
    }

    #[test]
    #[should_panic(expected = "2")]
    fn test_double_initialize() {
        let env = Env::default();
        let contract_id = env.register_contract(None, CounterContract);
        let client = CounterContractClient::new(&env, &contract_id);

        let owner = Address::generate(&env);
        client.initialize(&owner);
        client.initialize(&owner); // Should panic with error code 2
    }

    #[test]
    #[should_panic(expected = "1")]
    fn test_uninitialized_increment() {
        let env = Env::default();
        let contract_id = env.register_contract(None, CounterContract);
        let client = CounterContractClient::new(&env, &contract_id);

        client.increment(); // Should panic with error code 1
    }

    #[test]
    #[should_panic(expected = "1")]
    fn test_uninitialized_get() {
        let env = Env::default();
        let contract_id = env.register_contract(None, CounterContract);
        let client = CounterContractClient::new(&env, &contract_id);

        client.get(); // Should panic with error code 1
    }

    #[test]
    #[should_panic(expected = "1")]
    fn test_uninitialized_reset() {
        let env = Env::default();
        let contract_id = env.register_contract(None, CounterContract);
        let client = CounterContractClient::new(&env, &contract_id);

        let owner = Address::generate(&env);
        client.reset(&owner); // Should panic with error code 1
    }

    #[test]
    #[should_panic(expected = "3")]
    fn test_unauthorized_reset() {
        let env = Env::default();
        let contract_id = env.register_contract(None, CounterContract);
        let client = CounterContractClient::new(&env, &contract_id);

        let owner = Address::generate(&env);
        let unauthorized = Address::generate(&env);
        
        client.initialize(&owner);
        client.reset(&unauthorized); // Should panic with error code 3
    }

    #[test]
    #[should_panic(expected = "3")]
    fn test_unauthorized_reset_after_increments() {
        let env = Env::default();
        let contract_id = env.register_contract(None, CounterContract);
        let client = CounterContractClient::new(&env, &contract_id);

        let owner = Address::generate(&env);
        let unauthorized = Address::generate(&env);
        
        client.initialize(&owner);
        client.increment();
        client.increment();
        assert_eq!(client.get(), 2);
        
        client.reset(&unauthorized); // Should panic with error code 3
    }

    #[test]
    fn test_different_owners() {
        let env = Env::default();
        let contract_id = env.register_contract(None, CounterContract);
        let client = CounterContractClient::new(&env, &contract_id);

        let owner1 = Address::generate(&env);
        let owner2 = Address::generate(&env);
        
        client.initialize(&owner1);
        assert_eq!(client.get_owner(), owner1);
        
        // Only owner1 can reset
        client.reset(&owner1);
        assert_eq!(client.get(), 0);
        
        // owner2 cannot reset
        client.increment();
        assert_eq!(client.get(), 1);
    }

    #[test]
    fn test_contract_persistence_across_instances() {
        let env = Env::default();
        let contract_id = env.register_contract(None, CounterContract);
        
        let client1 = CounterContractClient::new(&env, &contract_id);
        let owner = Address::generate(&env);
        
        client1.initialize(&owner);
        client1.increment();
        client1.increment();
        
        // Create new client instance - should see same state
        let client2 = CounterContractClient::new(&env, &contract_id);
        assert_eq!(client2.get(), 2);
        assert_eq!(client2.get_owner(), owner);
        
        client2.increment();
        assert_eq!(client2.get(), 3);
        
        // Original client should see updated state
        assert_eq!(client1.get(), 3);
    }

    #[test]
    fn test_large_number_of_increments() {
        let env = Env::default();
        let contract_id = env.register_contract(None, CounterContract);
        let client = CounterContractClient::new(&env, &contract_id);

        let owner = Address::generate(&env);
        client.initialize(&owner);

        // Test many increments
        for _ in 0..100 {
            client.increment();
        }
        
        let final_count = client.get();
        assert!(final_count >= 100);
    }
}
