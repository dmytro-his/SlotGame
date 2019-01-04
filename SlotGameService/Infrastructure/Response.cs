using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SlotGameService.Infrastructure
{
    public abstract class Response
    {
        [JsonProperty]
        private Guid SessionId;

        [JsonProperty]
        private StatusResponse statusResponse;

        public Response(Guid sessionId, StatusResponse statusResponse)
        {
            this.SessionId = sessionId;
            this.statusResponse = statusResponse;
        }
    }
}
