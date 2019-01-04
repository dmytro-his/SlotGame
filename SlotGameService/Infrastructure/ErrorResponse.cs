using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SlotGameService.Infrastructure
{
    public class ErrorResponse : Response
    {
        public Exception error;

        public ErrorResponse(Guid sessionId, Exception exception)
            : base(sessionId, StatusResponse.Error)
        {
            this.error = exception;
        }
    }
}
