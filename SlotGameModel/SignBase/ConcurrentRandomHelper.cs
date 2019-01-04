using System;
using System.Collections.Generic;
using System.Text;

namespace SlotGame.Model
{
    static class ConcurrentRandomHelper
    {
        private static Random _random = new Random();
        private static object _locker = new object();

        public static double GenRandom()
        {
            lock (_locker)
                return _random.NextDouble();
        }
    }
}
