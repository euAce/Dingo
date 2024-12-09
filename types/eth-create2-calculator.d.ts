declare module 'eth-create2-calculator' {
    export function calculateCreate2(
        factoryAddress: string,
        salt: string,
        bytecode: string,
        constructorArgs?: {
            params: any[];
            types: string[];
        }
    ): string;
} 