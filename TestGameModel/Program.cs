using SlotGame.Model;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace TestGameModel
{
    class Program
    {
        static void Main(string[] args)
        {
            int spinCount = 1000000;
            int cashCount = 1000000;
            Cash bet = new Cash(Currency.EUR, 100);
            Console.WriteLine($"SpinCount: {spinCount}");
            Console.WriteLine($"CashCount: {cashCount}");
            Console.WriteLine($"Bet: {bet}");

            //int taskCount = 1000;
            //Task[] tasks = new Task[taskCount];
            //for (int t = 0; t < taskCount; t++)
            //{
            //    tasks[t] = Task.Factory.StartNew(() => SimulateGame(new Cash(Currency.EUR, cashCount), spinCount, bet));
            //}

            //Task.WaitAll(tasks);
            SimulateGame(new Cash(Currency.EUR, cashCount), spinCount, bet);
            Console.WriteLine("end");
            Console.ReadKey();
        }

        public static void SimulateGame(Cash cash, int spinCount, Cash bet)
        {
            HappySlotGame game = HappySlotGame.Fabrica.CreateNew(cash);

            Dictionary<WinResponse, int> winningInfo = new Dictionary<WinResponse, int>();
            decimal i;
            for (i = 0; i < spinCount; i++)
            {
                var wintype = game.Spin(bet);

                winningInfo[wintype] = winningInfo.ContainsKey(wintype) ? winningInfo[wintype] + 1 : 1;

                if (game.Cash.Count < 0)
                    break;
            }

            string resultInfo = $"ThreadID: {Thread.CurrentThread.ManagedThreadId}\n" +
                                $"TaskID: {Task.CurrentId}\n";
            decimal fullWin = 0;
            foreach (var wininfo in winningInfo)
            {
                var name = $"X{wininfo.Key.Name.ToString()}";
                decimal count = wininfo.Value;
                decimal coef = wininfo.Key.Multiplier;
                fullWin += count * coef * bet.Count;
                resultInfo += $"{Thread.CurrentThread.ManagedThreadId}|{Task.CurrentId}" +
                                $"| {name}: {count} " +
                                $"| Probability: {count / i} " +
                                $"| return: {count * coef * bet.Count / i}\n";
            }

            resultInfo += $"{Thread.CurrentThread.ManagedThreadId}|{Task.CurrentId}| All return: {fullWin / (i * bet.Count)}\n";

            Console.WriteLine(resultInfo);
        }

    }
}
