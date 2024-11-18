library Market {
    struct Props {
        address marketToken;
        address indexToken;
        address longToken;
        address shortToken;
    }
}

interface IReader {
    function getMarket(
        address dataStore,
        address key
    ) external view returns (Market.Props memory);
}