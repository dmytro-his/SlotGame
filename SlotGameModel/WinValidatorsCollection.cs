using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;

namespace SlotGame.Model
{
    internal class WinValidatorsCollection : IEnumerable<WinValidator>
    {
        List<WinValidator> winValidators = new List<WinValidator>();

        public IEnumerator<WinValidator> GetEnumerator()
        {
            return winValidators.GetEnumerator();
        }

        IEnumerator IEnumerable.GetEnumerator()
        {
            return winValidators.GetEnumerator();
        }

        public void Add(WinValidator validator)
        {
            winValidators.Add(validator);
        }

        internal WinValidator CheckWin(GameField gameField)
        {
            return this.OrderByDescending(v => v.Multiplier).ThenBy(v=>Guid.NewGuid()).First(v => v.CheckForWin(gameField));
        }
    }
}