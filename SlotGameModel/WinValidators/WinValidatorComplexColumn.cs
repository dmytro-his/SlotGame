namespace SlotGame.Model
{
    //       _________________
    //      |*      *         |
    //      |   *           * |
    //      |           *     |
    
    class WinValidatorComplexColumn : WinValidator
    {
        private readonly SignName _wantedSign;
        private int _countColumn;
        public WinValidatorComplexColumn(string name, SignName inputSign, int countColumn, decimal multiplier) : base(name, multiplier)
        {
            this._wantedSign = inputSign;
            this._countColumn = countColumn;
        }

        public override bool CheckForWin(GameField gameField)
        {
            var tempResult = false;
            var winStatusField = new SignWinStatus[gameField.RowsCount][];
            for (int i = 0; i < gameField.RowsCount; i++)
                winStatusField[i] = new SignWinStatus[gameField.ColumnsCount];

            for (int i = 0; i < _countColumn; i++)
            {
                tempResult = false;
                for (int j = 0; j < gameField.RowsCount; j++)
                    if (gameField[j, i] == _wantedSign)
                    {
                        tempResult = true;
                        winStatusField[j][i] = SignWinStatus.Win;
                        break;
                    }
                if (tempResult == false)
                    return false;
            }
            gameField.SignsWinStatus = winStatusField;
            return true;
        }
    }
}
