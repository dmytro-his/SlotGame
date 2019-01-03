using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;

namespace SlotGame.Model
{
    public class GameField
    {
        private readonly Sign[][] _signs;

        public Sign this[int i, int j]
        {
            get
            {
                return _signs[i][j];
            }
        }
        
        public readonly int RowsCount;
        public readonly int ColumnsCount;
        private readonly SignCollection _signCollection;
        private readonly IEnumerable<WinValidator> _winValidators;

        private GameField(int rows, int columns, SignCollection signCollection, IEnumerable<WinValidator> winValidators)
        {
            this.RowsCount = rows;
            this.ColumnsCount = columns;
            this._signCollection = signCollection;
            this._winValidators = winValidators.OrderByDescending(validator=>validator.Multiplier);

            _signs = new Sign[rows][];

            for (int i = 0; i < rows; i++)
                _signs[i] = new Sign[columns];

            _generateSigns();
        }

        internal WinValidator GetCurrentWin()
        {
            foreach(var validator in _winValidators)
            {
                if (validator.CheckForWin(this))
                    return validator;
            }
            return new WinValidatorX0("X0");
        }

        private void _generateSigns()
        {
            for (int i = 0; i < RowsCount; i++)
                for (int j = 0; j < ColumnsCount; j++)
                    _signs[i][j] = _signCollection.GetRandomSign();
        }

        public void ReRandom()
        {
            _generateSigns();
        }

        internal static class Fabrica
        {
            internal static GameField GetRandomField
                (
                    int rows, 
                    int columns, 
                    SignCollection signCollection,
                    WinValidator[] winValidators
                )
            {
                return new GameField(rows, columns, signCollection, winValidators);
            }
            
        }
    }
}