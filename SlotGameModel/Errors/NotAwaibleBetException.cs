using System;
using System.Runtime.Serialization;

namespace SlotGame.Model
{
    [Serializable]
    internal class NotAwaibleBetException : GameException
    {
        public NotAwaibleBetException()
        {
        }

        public NotAwaibleBetException(string message) : base(message)
        {
        }

        public NotAwaibleBetException(string message, Exception innerException) : base(message, innerException)
        {
        }

        protected NotAwaibleBetException(SerializationInfo info, StreamingContext context) : base(info, context)
        {
        }
    }
}