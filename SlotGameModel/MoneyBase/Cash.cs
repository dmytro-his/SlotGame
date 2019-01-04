using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SlotGame.Model
{
    public class Cash
    {
        public decimal Count { get; set; }
        public readonly Currency Currency;

        public Cash(Currency currency, decimal count)
        {
            this.Currency = currency;
            this.Count = count;
        }
        
        public Cash()
        {
            this.Currency = Currency.USD;
            this.Count = 0;
        }
        public override string ToString()
        {
            return $"{Count} {Currency}";
        }
    }
}
