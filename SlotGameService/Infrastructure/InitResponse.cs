using SlotGame.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SlotGameService.Infrastructure
{
    public class InitResponse : Response
    {
        public SignName[][] GameField;

        public InitResponse(Guid sessionId)
            : base(sessionId, StatusResponse.OK)
        {
        }

    }
}
