namespace SlotGame.Model
{
    public class WinResponse
    {
        public string Name;
        public decimal Multiplier { get; }
        public Cash Bet { get; }
        public bool Win { get; }
        public Cash Profit { get; }

        public WinResponse(string name, Cash bet, decimal multiplier)
        {
            this.Name = name;
            this.Bet = bet;
            this.Multiplier = multiplier;
            this.Win = multiplier > 1;
            this.Profit = new Cash(bet.Currency, bet.Count * multiplier);
        }

        public override bool Equals(object obj)
        {
            if (obj == null)
                return false;

            if (!(obj is WinResponse))
                return false;

            if (ReferenceEquals(obj, this))
                return true;

            return Equals(obj as WinResponse);
        }
        public bool Equals(WinResponse response)
        {
            return response.Name == this.Name && response.Multiplier == this.Multiplier;
        }
        public override int GetHashCode()
        {
            return Name.GetHashCode() ^ Multiplier.GetHashCode();
        }
        public static class Fabrica
        {
            public static WinResponse CreateNew(string name, Cash bet, decimal multiplier)
            {
                return new WinResponse(name, bet, multiplier);
            }
        }
    }
}