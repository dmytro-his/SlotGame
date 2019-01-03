using System;
using System.Collections.Generic;
using System.Text;

namespace SlotGame.Model
{
    class WinValidatorX5 : WinValidator
    {
        public WinValidatorX5(string name, decimal multiplier) : base(name, multiplier)
        {
        }

        public override bool CheckForWin(GameField gameField)
        {
            for (int i = 0; i < gameField.RowsCount; i++)
            {
                for (int j = 0; j < gameField.ColumnsCount; j++)
                    if (gameField[i, j].Name == SignName.Vip1 || gameField[i, j].Name != gameField[i, 0].Name)
                        goto nextRow;

                return true;

                nextRow:;
            }
            return false;
        }
    }
}
