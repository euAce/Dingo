pragma solidity ^0.8.19;

library Constants {
    address public constant USDC = 0xaf88d065e77c8cC2239327C5EDb3A432268e5831;  // адрес USDC
    address public constant WETH = 0x82aF49447D8a07e3bd95BD0d56f35241523fBab1; // адрес WETH

    address constant MARKET_FACTORY = 0x75E42e6f01baf1D6022bEa862A28774a9f8a4A0C; // адрес фабрики рынков
    address public constant EXCHANGE_ROUTER = 0x69C527fC77291722b52649E45c838e41be8Bf5d5; // адрес роутера обмена
    address public constant DEPOSIT_VAULT = 0xF89e77e8Dc11691C9e8757e84aaFbCD8A67d7A55; // адрес хранилища депозитов
    address public constant ORDER_VAULT = 0x31eF83a530Fde1B38EE9A18093A333D8Bbbc40D5; // контракт, который работает как хранилище для всех ордеров в системе.

    address public constant WETH_USDC_MARKET = 0x45aD16Aaa28fb66Ef74d5ca0Ab9751F2817c81a4; // адрес рынка WETH/USDC
    address public constant READER = 0x23D4Da5C7C6902D4C86d551CaE60d5755820df9E; // контракт, который работает как читатель для всех данных в системе.
    address public constant DATA_STORE = 0xFD70de6b91282D8017aA4E741e9Ae325CAb992d8; // контракт, который работает как база данных, сохраняющая параметры и состояния, используемые другими контрактами в системе.
    address public constant ROUTER = 0x7452c558d45f8afC8c83dAe62C3f8A5BE19c71f6; // контракт, который работает как маршрутизатор для всех транзакций в системе.
}