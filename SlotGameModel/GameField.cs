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
        
        internal GameField(int rows, int columns, SignCollection signCollection)
        {
            this.RowsCount = rows;
            this.ColumnsCount = columns;
            this._signCollection = signCollection;

            _signs = new Sign[rows][];

            for (int i = 0; i < rows; i++)
                _signs[i] = new Sign[columns];

            //GenerateSigns();
        }
        
        
        public void GenerateSigns()
        {
            for (int i = 0; i < RowsCount; i++)
                for (int j = 0; j < ColumnsCount; j++)
                    _signs[i][j] = _signCollection.GetRandomSign();
        }

        public override string ToString()
        {
            var result = String.Empty;
            for (int i = 0; i < RowsCount; i++)
            {
                for (int j = 0; j < ColumnsCount; j++)
                {
                    result += _signs[i][j].Name+"\t";
                }
                result += Environment.NewLine;
            }
            return result;
        }

        public static explicit operator Sign[][](GameField gameField)
        {
            return gameField._signs;    
        }
    }
}