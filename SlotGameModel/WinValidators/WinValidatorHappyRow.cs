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
                if (gameField[i, 0] == SignName.HappyCharH &&
                    gameField[i, 1] == SignName.HappyCharA &&
                    gameField[i, 2] == SignName.HappyCharP &&
                    gameField[i, 3] == SignName.HappyCharP &&
                    gameField[i, 4] == SignName.HappyCharY)
                    return true;
            }
            return false;
        }
    }
}
