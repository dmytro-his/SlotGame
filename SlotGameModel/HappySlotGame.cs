using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SlotGame.Model
{
    //Client
    public class HappySlotGame
    {
        public readonly Guid Guid;

        public Cash Cash { get; private set; }

        public GameField GameField;

        private HappySlotGame(Cash cash)
        {
            Guid = Guid.NewGuid();

            GameField = GameField.Fabrica.GetRandomField(3, 5, 
                SignCollection.Default, 
                new WinValidator[] 
                {
                    new WinValidatorX20("X20", 20),
                    new WinValidatorX5("X5", 5),
                    new WinValidatorX0("X0")
                });

            this.Cash = cash;
        }
        
        public WinResponse Spin(Cash bet)
        {
            Cash.Count -= bet.Count;
            GameField.ReRandom();
            var winValidator = GameField.GetCurrentWin();

            Cash.Count += bet.Count * winValidator.Multiplier;

            return new WinResponse(winValidator.Name, bet, winValidator.Multiplier);
        }

        public static class Fabrica
        {
            public static HappySlotGame CreateNew(Cash cash)
            {
                return new HappySlotGame(cash);
            }

            public static HappySlotGame CreateNew(Currency currency, decimal count)
            {
                Cash cash = new Cash(currency, count);
                return CreateNew(cash);
            }

        }
    }
}
