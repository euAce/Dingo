// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol"; 
import "@openzeppelin/contracts/access/Ownable.sol"; 

contract DeltaNeutralStrategy is Ownable {
    // Структура для хранения позиции
    struct Position {
        uint256 longAmount;  // Длинная позиция
        uint256 shortAmount; // Короткая позиция
        uint256 entryPrice; // Цена входа
        bool isActive;      // Активна ли позиция
    }

    // Маппинг для хранения позиций пользователей
    mapping(address => Position) public positions;
    
    // Токены для торговли
    IERC20 public baseToken;
    IERC20 public quoteToken;
    
    // Максимальное отклонение дельты от нуля (в процентах)
    uint256 public constant MAX_DELTA_DEVIATION = 1; // 1%

    constructor(address _baseToken, address _quoteToken) {
        baseToken = IERC20(_baseToken);
        quoteToken = IERC20(_quoteToken);
    }

    // Открытие дельта-нейтральной позиции
    function openPosition(uint256 longAmount, uint256 shortAmount, uint256 currentPrice) external {
        require(!positions[msg.sender].isActive, "Position already exists");
        require(isDeltaNeutral(longAmount, shortAmount), "Position is not delta neutral");
        
        // Проверяем наличие достаточного количества токенов
        require(baseToken.balanceOf(msg.sender) >= longAmount, "Insufficient base tokens");
        require(quoteToken.balanceOf(msg.sender) >= shortAmount * currentPrice, "Insufficient quote tokens");

        // Переводим токены на контракт
        baseToken.transferFrom(msg.sender, address(this), longAmount);
        quoteToken.transferFrom(msg.sender, address(this), shortAmount * currentPrice);

        // Создаем позицию
        positions[msg.sender] = Position({
            longAmount: longAmount,
            shortAmount: shortAmount,
            entryPrice: currentPrice,
            isActive: true
        });

        emit PositionOpened(msg.sender, longAmount, shortAmount, currentPrice);
    }

    // Закрытие позиции
    function closePosition(uint256 currentPrice) external {
        Position storage position = positions[msg.sender];
        require(position.isActive, "No active position");

        uint256 longValue = position.longAmount * currentPrice;
        uint256 shortValue = position.shortAmount * currentPrice;

        // Возвращаем токены пользователю
        baseToken.transfer(msg.sender, position.longAmount);
        quoteToken.transfer(msg.sender, shortValue);

        // Рассчитываем PnL
        int256 pnl = calculatePnL(position, currentPrice);

        // Сбрасываем позицию
        delete positions[msg.sender];

        emit PositionClosed(msg.sender, pnl, currentPrice);
    }

    // Ребалансировка позиции для поддержания дельта-нейтральности
    function rebalancePosition(uint256 newLongAmount, uint256 newShortAmount, uint256 currentPrice) external {
        Position storage position = positions[msg.sender];
        require(position.isActive, "No active position");
        require(isDeltaNeutral(newLongAmount, newShortAmount), "New position is not delta neutral");

        // Обновляем позицию
        position.longAmount = newLongAmount;
        position.shortAmount = newShortAmount;

        emit PositionRebalanced(msg.sender, newLongAmount, newShortAmount, currentPrice);
    }

    // Проверка дельта-нейтральности
    function isDeltaNeutral(uint256 longAmount, uint256 shortAmount) public pure returns (bool) {
        // Упрощенная проверка: длинная и короткая позиции должны быть примерно равны
        if (longAmount > shortAmount) {
            return (longAmount - shortAmount) * 100 / longAmount <= MAX_DELTA_DEVIATION;
        } else {
            return (shortAmount - longAmount) * 100 / shortAmount <= MAX_DELTA_DEVIATION;
        }
    }

    // Расчет PnL
    function calculatePnL(Position memory position, uint256 currentPrice) public pure returns (int256) {
        int256 longPnL = int256(position.longAmount * currentPrice) - int256(position.longAmount * position.entryPrice);
        int256 shortPnL = int256(position.shortAmount * position.entryPrice) - int256(position.shortAmount * currentPrice);
        return longPnL + shortPnL;
    }

    // События
    event PositionOpened(address indexed trader, uint256 longAmount, uint256 shortAmount, uint256 price);
    event PositionClosed(address indexed trader, int256 pnl, uint256 price);
    event PositionRebalanced(address indexed trader, uint256 newLongAmount, uint256 newShortAmount, uint256 price);
} 