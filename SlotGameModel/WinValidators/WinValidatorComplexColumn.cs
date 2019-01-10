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
            for (int i = 0; i < _countColumn; i++)
            {
                tempResult = false;
                for (int j = 0; j < gameField.RowsCount; j++)
                    if (gameField[j, i] == _wantedSign)
                    {
                        tempResult = true;
                        break;
                    }
                if (tempResult == false)
                    return false;
            }
            return true;
        }
    }
}
