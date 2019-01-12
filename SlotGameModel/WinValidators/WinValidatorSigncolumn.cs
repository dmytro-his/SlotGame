namespace SlotGame.Model
{
    //       _________________
    //      |*                |
    //      |*                |
    //      |*                |

    class WinValidatorSignColumn : WinValidator
    {
        private readonly SignName _wantedSign;

        public WinValidatorSignColumn(SignName inputSign, decimal multiplier) : base($"SignColumn|{inputSign.ToString()}|", multiplier)
        {
            this._wantedSign = inputSign;
        }

        public override bool CheckForWin(GameField gameField)
        {
            
            for (int i = 0; i < gameField.ColumnsCount; i++)
            {
                for (int j = 0; j < gameField.RowsCount; j++)
                    if (gameField[j, i] != _wantedSign)
                        goto nextColumn;

                for (int r = 0; r < gameField.RowsCount; r++)
                    gameField.SignsWinStatus[r][i] = SignWinStatus.Win;
                return true;

                nextColumn:;
            }
            return false;
        }
    }
}
