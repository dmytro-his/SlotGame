namespace SlotGame.Model
{
    //       _________________
    //      |*  *   *   *   * |
    //      |                 |
    //      |                 |

    class WinValidatorSignRow : WinValidator
    {
        private readonly SignName _wantedSign;

        public WinValidatorSignRow(SignName inputSign, decimal multiplier) : base($"SignRow|{inputSign.ToString()}|", multiplier)
        {
            this._wantedSign = inputSign;
        }

        public override bool CheckForWin(GameField gameField)
        {
            for (int i = 0; i < gameField.RowsCount; i++)
            {
                for (int j = 0; j < gameField.ColumnsCount; j++)
                    if (gameField[i, j] != _wantedSign)
                        goto nextRow;

                return true;

                nextRow:;
            }
            return false;
        }
    }
}
