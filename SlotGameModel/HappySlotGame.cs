using System;

namespace SlotGame.Model
{
    //Client
    public class HappySlotGame
    {
        public readonly Guid Guid = Guid.NewGuid();

        public Cash Cash { get; private set; }

        public GameField GameField;

        private static WinValidatorsCollection WinValidators;

        static HappySlotGame()
        {
            WinValidators = new WinValidatorsCollection();
            int coefForRow = 5;
            int coefForColumn = 2;
            int coefForComplexColumn = 2;

            foreach (SignName sign in Enum.GetValues(typeof(SignName)))
            {
                var multiplier = 0;
                switch (sign)
                {
                    case SignName.HappyVip:
                        multiplier = 5;
                        break;
                    case SignName.HappyFace1:
                    case SignName.HappyFace2:
                        multiplier = 3;
                        break;
                    case SignName.HappyCharH:
                    case SignName.HappyCharA:
                    case SignName.HappyCharP:
                    case SignName.HappyCharY:
                        multiplier = 2;
                        break;
                }
                WinValidators.Add(new WinValidatorComplexColumn($"{sign.ToString()}*{5}", sign, 5, multiplier * coefForComplexColumn));
                WinValidators.Add(new WinValidatorSignRow(sign, multiplier * coefForRow));
                WinValidators.Add(new WinValidatorSignColumn(sign, multiplier * coefForColumn));
            }

            WinValidators.Add(new WinValidatorHappyRow(100));
            WinValidators.Add(new WinValidatorX0("X0"));
        }

        public HappySlotGame(Cash cash)
        {
            GameField = new GameField(3, 5, SignCollection.Default);

            this.Cash = cash;

            while (this.Spin().Win) ; // spin while win without bet
        }

        private WinResponse Spin()
        {
            GameField.GenerateSigns();

            var winValidator = WinValidators.CheckWin(GameField);

            return new WinResponse(winValidator.Name, new Cash(), winValidator.Multiplier);

        }

        public WinResponse Spin(Cash bet)
        {
            Cash.Count -= bet.Count;
            GameField.GenerateSigns();


            var winValidator = WinValidators.CheckWin(GameField);

            Cash.Count += bet.Count * winValidator.Multiplier;
            
            return new WinResponse(winValidator.Name, bet, winValidator.Multiplier);
        }

    }
}
