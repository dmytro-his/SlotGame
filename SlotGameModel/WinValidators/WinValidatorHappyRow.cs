namespace SlotGame.Model
{
    //       _________________
    //      |H  A   P   P   Y |
    //      |                 |
    //      |                 |
    
    class WinValidatorHappyRow : WinValidator
    {
        
        public WinValidatorHappyRow(decimal multiplier) : base("HappyRow", multiplier)
        {
        }

        public override bool CheckForWin(GameField gameField)
        {
            for (int i = 0; i < gameField.RowsCount; i++)
            {
                if (gameField[i, 0].Name == SignName.HappyCharH &&
                    gameField[i, 1].Name == SignName.HappyCharA &&
                    gameField[i, 2].Name == SignName.HappyCharP &&
                    gameField[i, 3].Name == SignName.HappyCharP &&
                    gameField[i, 4].Name == SignName.HappyCharY)
                    return true;
            }
            return false;
        }
    }
}
