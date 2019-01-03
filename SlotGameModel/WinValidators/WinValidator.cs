namespace SlotGame.Model
{
    abstract class WinValidator
    {
        public readonly string Name;
        public decimal Multiplier { get; set; }
        public abstract bool CheckForWin(GameField gameField);

        public WinValidator(string name, decimal multiplier)
        {
            this.Name = name;
            this.Multiplier = multiplier;
        }
    }
}