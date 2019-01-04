namespace SlotGame.Model
{
    public enum BetLevel
    {
        x10 = 1,
        x20 = 2,
        x50 = 3,
        x100 = 4,
        x500 = 5
    }

    public static class BetLevelExtension
    {
        public static decimal GetBet(this BetLevel betLevel)
        {
            switch (betLevel)
            {
                case BetLevel.x10:
                    return 10;
                case BetLevel.x20:
                    return 20;
                case BetLevel.x50:
                    return 50;
                case BetLevel.x100:
                    return 100;
                case BetLevel.x500:
                    return 500;
                default:
                    return 10;
            }
        }
    }
}