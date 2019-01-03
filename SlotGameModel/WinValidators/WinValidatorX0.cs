using System;
using System.Collections.Generic;
using System.Text;

namespace SlotGame.Model
{
    class WinValidatorX0 : WinValidator
    {

        public WinValidatorX0(string name) : base(name, 0)
        {
        }

        public override bool CheckForWin(GameField gameField)
        {
            return true;
        }
    }
}
