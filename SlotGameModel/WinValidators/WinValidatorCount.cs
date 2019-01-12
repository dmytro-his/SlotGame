namespace SlotGame.Model
{
    //       _________________
    //      |*      *         |
    //      |   *           * |
    //      |           *     |

    class WinValidatorCount : WinValidator
    {
        private readonly SignName _wantedSign;
        private int _count;
        public WinValidatorCount(string name, SignName inputSign, int count, decimal multiplier) : base(name, multiplier)
        {
            this._wantedSign = inputSign;
            this._count = count;
        }

        public override bool CheckForWin(GameField gameField)
        {
            var count = 0;

            var winStatusField = new SignWinStatus[gameField.RowsCount][];
            for (int i = 0; i < gameField.RowsCount; i++)
                winStatusField[i] = new SignWinStatus[gameField.ColumnsCount];


            for (int i = 0; i < gameField.RowsCount; i++)
            {
                for (int j = 0; j < gameField.ColumnsCount; j++)
                {
                    if (gameField[i, j] == _wantedSign)
                    {
                        count++;
                        winStatusField[i][j] = SignWinStatus.Win;
                    }
                    if (count >= _count)
                    {
                        gameField.SignsWinStatus = winStatusField;
                        return true;
                    }
                }
            }
            return false;
        }
    }
}
