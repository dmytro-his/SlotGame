using SlotGame.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SlotGameService.Infrastructure
{
    public class SpinResponse : Response
    {
        public bool IsWin;
        public Cash Bet;
        public Cash Profit;
        public Cash Cash;
        public decimal Multiplier;
        public SignName[][] GameField;
        public SignWinStatus[][] SignsWinStatus;

        public SpinResponse(Guid sessionId)
            : base(sessionId, StatusResponse.OK)
        {
        }

    }
}
