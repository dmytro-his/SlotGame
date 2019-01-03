using System;
using System.Collections.Generic;
using System.Text;

namespace SlotGame.Model
{
    class WinValidatorX20 : WinValidator
    {
        public WinValidatorX20(string name, decimal multiplier) : base(name, multiplier)
        {
        }

        public override bool CheckForWin(GameField gameField)
        {
            var temp = false;
            for (int i = 0; i < gameField.ColumnsCount; i++)
            {
                temp = false;
                for (int j = 0; j < gameField.RowsCount; j++)
                    if (gameField[j, i].Name == SignName.Vip1)
                    {
                        temp = true;
                        break;
                    }
                if (temp == false)
                    return false;
            }
            return true;
        }
    }
}
