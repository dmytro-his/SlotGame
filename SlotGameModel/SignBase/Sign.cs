using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SlotGame.Model
{
    public class Sign
    {
        public SignName Name { get; set; }

        public decimal Probability { get; }

        public Sign(SignName name, decimal probability)
        {
            this.Name = name;
            this.Probability = probability;
        }

        public override string ToString()
        {
            return Name.ToString();
        }
    }
}
