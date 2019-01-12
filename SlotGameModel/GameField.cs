using System;
using System.Linq;

namespace SlotGame.Model
{
    public class GameField
    {
        private readonly SignName[][] _signs;

        private SignWinStatus[][] _signsWinStatus;
        public SignWinStatus[][] SignsWinStatus
        {
            get
            {
                if (_signsWinStatus == null)
                {
                    _signsWinStatus = new SignWinStatus[RowsCount][];
                    for (int i = 0; i < _signsWinStatus.Length; i++)
                    {
                        _signsWinStatus[i] = new SignWinStatus[ColumnsCount];
                    }
                }
                return _signsWinStatus;
            }
            set
            {
                if (value==null || (value.Length == RowsCount && value.All(v => v.Length == ColumnsCount)))
                _signsWinStatus = value;
            }
        }

        public SignName this[int i, int j]
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

            _signs = new SignName[rows][];

            for (int i = 0; i < rows; i++)
                _signs[i] = new SignName[columns];

            //GenerateSigns();
        }


        public void GenerateSigns()
        {
            _signsWinStatus = null;
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
                    result += _signs[i][j] + "\t";
                }
                result += Environment.NewLine;
            }
            return result;
        }

        public static explicit operator SignName[][] (GameField gameField)
        {
            return gameField._signs;
        }
    }
}