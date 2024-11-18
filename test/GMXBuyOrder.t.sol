// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "forge-std/Test.sol";
import "../src/Constants.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../src/interfaces/IExchangeRouter.sol";
import "../src/interfaces/IBaseOrderUtils.sol";
import "../src/interfaces/IOrder.sol";
import "../src/interfaces/IReader.sol";

contract GMXBuyOrderTest is Test {
    IExchangeRouter public exchangeRouter;
    IReader public reader;
    IERC20 public tokenIn;
    address public user;

    function setUp() public {
        tokenIn = IERC20(Constants.USDC);
        user = vm.addr(1);
        exchangeRouter = IExchangeRouter(Constants.EXCHANGE_ROUTER);
        reader = IReader(Constants.READER);
    }
 
    function testBuyGM() public {
        uint256 amountIn = 1000 * 10**18; // 1000 USDC
        uint256 minOut = 990 * 10**18; // 990 USDC
        uint256 executionFee = 0.005 * 10**18; // 0.005 ETH
        uint256 executionFee2 = 1.100 * 10**18; // 1.100 ETH
        
        // Код реферала
        bytes32 referralCode = keccak256(abi.encodePacked("referralCode"));

        // Начать пранк 
        vm.startPrank(user);

        // Передать токены от конракта к пользователю
        deal(address(tokenIn), address(user), amountIn);

        console.log("User balance: %d", user.balance);

        // Проверка баланса токенов
        require(tokenIn.balanceOf(user) == amountIn, "Token deal failed");

        // Передать пользователю ETH для оплаты комиссии
        vm.deal(user, executionFee2);

        // Проверка баланса ETH
        require(user.balance == executionFee2, "ETH deal failed");

        // Дать разрешение другому адресу на управление определённым количеством токенов от вашего имени
        tokenIn.approve(address(exchangeRouter), type(uint256).max);
        
        // Проверить, что разрешение на токены установлено
        require(tokenIn.allowance(user, address(exchangeRouter)) == type(uint256).max, "Token approval failed");

        // Массив вызовов
        bytes[] memory calls = new bytes[](2);

        // Вызов функции sendWnt
        calls[0] = abi.encodeWithSelector(
            exchangeRouter.sendWnt.selector,
            Constants.ORDER_VAULT,
            executionFee
        );

        // Получить информацию о рынке
        Market.Props memory marketProps = reader.getMarket(
            Constants.DATA_STORE,
            Constants.WETH_USDC_MARKET
        );

        console.log("Market token: %s", marketProps.marketToken);

        // Путь обмена для обмена токенов
        address[] memory swapPath = new address[](1);
        swapPath[0] = address(marketProps.marketToken); 


        // Параметры создания заявки
        // https://gmx-docs.io/docs/api/contracts-v2#creating-an-order
        IBaseOrderUtils.CreateOrderParams memory params = IBaseOrderUtils
            .CreateOrderParams({
                addresses: IBaseOrderUtils.CreateOrderParamsAddresses({
                    receiver: address(user), // Получатель
                    cancellationReceiver: address(user), // Получатель отмены
                    callbackContract: address(0), // Контракт обратного вызова
                    uiFeeReceiver: address(0), // Получатель комиссии UI - не используется
                    market: address(Constants.WETH_USDC_MARKET), // Адрес токена рынка
                    initialCollateralToken: address(tokenIn), // Адрес токена начального залога
                    swapPath: swapPath // Путь обмена
                }),
                numbers: IBaseOrderUtils.CreateOrderParamsNumbers({
                    sizeDeltaUsd: amountIn, // размер позиции для увеличения/уменьшения
                    initialCollateralDeltaAmount: amountIn, // Начальный залог
                    triggerPrice: 0, // Цена триггера
                    acceptablePrice: amountIn, // Допустимая цена
                    executionFee: executionFee, // Комиссия исполнения
                    callbackGasLimit: 200000, // Лимит газа обратного вызова
                    minOutputAmount: 0, // Минимальное количество выходных токенов
                    validFromTime: 0 // Время начала действия заявки
                }),
                orderType: IOrder.OrderType.MarketSwap, // Тип заявки
                decreasePositionSwapType: IOrder.DecreasePositionSwapType.NoSwap, // Тип обмена для уменьшения позиции
                isLong: false, // Длинная позиция
                shouldUnwrapNativeToken: false, // Распаковать нативный токен
                referralCode: referralCode, // Код реферала
                autoCancel: false // Автоматическая отмена
            });


        // Добавление createOrder в массив вызовов
        calls[1] = abi.encodeWithSelector(
            exchangeRouter.createOrder.selector,
            params
        );

        xchangeRouter.multicall{value: executionFee}(calls)
    }
}