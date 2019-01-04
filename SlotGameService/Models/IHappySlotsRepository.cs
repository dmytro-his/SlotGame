using SlotGame.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SlotGameService.Models
{
    public interface IHappySlotsRepository
    {
        IEnumerable<HappySlotGame> HappySlots { get; }

        void Add(HappySlotGame slotGame);

        bool Remove(HappySlotGame slotGame);

        HappySlotGame GetGame(Guid guid);

    }
}
