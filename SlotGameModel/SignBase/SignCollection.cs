using System;
using System.Collections;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SlotGame.Model
{
    public class SignCollection : IEnumerable<Sign>
    {
        private ConcurrentQueue<Sign> _signs = new ConcurrentQueue<Sign>();

        //private List<Sign> _signs = new List<Sign>(); why this work 
        public int Count => _signs.Count;

        public void Add(Sign sign)
        {
            this._signs.Enqueue(sign);
        }

        public IEnumerator<Sign> GetEnumerator()
        {
            return this._signs.GetEnumerator();
        }

        IEnumerator IEnumerable.GetEnumerator()
        {
            return ((IEnumerable)this._signs).GetEnumerator();
        }

        private bool CheckValidation()
        {
            return _signs.Sum(s => s.Probability) == 100;
        }

        private readonly Random _random = new Random();

        private readonly object _locker = new object();

        public Sign GetRandomSign()
        {
            if (!CheckValidation())
                throw new Exception("Sum of Probabilities must be 100");

            decimal rand = GetRandomNumber();

            decimal GetRandomNumber()
            {
                lock (_locker)
                    return Convert.ToDecimal(this._random.NextDouble()) * 100;
            }

            decimal currentSum = 0;

            for (int i = 0; i < this._signs.Count; i++)
            {
                currentSum += this._signs.ElementAt(i).Probability;

                if (currentSum >= rand)
                    return this._signs.ElementAt(i);
            }

            throw new NotImplementedException("Out Random Exception");

        }

        public static SignCollection Default = new SignCollection
            {
                new Sign(SignName.Simple1, 19.2242m),
                new Sign(SignName.Simple2, 19.2242m),
                new Sign(SignName.Simple3, 19.2242m),
                new Sign(SignName.Simple4, 19.2242m),
                new Sign(SignName.Vip1, 23.1032m)
            };

        

        //public static SignCollection Default2 = new SignCollection
        //    {
        //        new Sign(SignName.Simple1, 17.9873m),
        //        new Sign(SignName.Simple2, 17.9873m),
        //        new Sign(SignName.Simple3, 17.9873m),
        //        new Sign(SignName.Simple4, 17.9873m),
        //        new Sign(SignName.Vip1, 28.0508m)
        //    };
    }
}
