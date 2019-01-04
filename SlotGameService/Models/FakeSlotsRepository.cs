using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SlotGame.Model;

namespace SlotGameService.Models
{
    public class FakeSlotsRepository : IHappySlotsRepository
    {
        private List<HappySlotGame> _happySlots = new List<HappySlotGame>();
        public IEnumerable<HappySlotGame> HappySlots { get => _happySlots; }

        public void Add(HappySlotGame slotGame)
        {
            _happySlots.Add(slotGame);
        }

        public HappySlotGame GetGame(Guid guid)
        {
            return _happySlots.FirstOrDefault(g => g.Guid == guid);
        }

        public bool Remove(HappySlotGame slotGame)
        {
            return _happySlots.Remove(slotGame);
        }
    }
}
