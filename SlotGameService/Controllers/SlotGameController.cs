using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using SlotGame.Model;
using SlotGameService.Infrastructure;
using SlotGameService.Models;

namespace SlotGameService.Controllers
{
    //[Route("api/[controller]")]
    public class SlotGameController : Controller
    {
        readonly IHappySlotsRepository _repository;

        public SlotGameController(IHappySlotsRepository repository)
        {
            this._repository = repository;

        }
        //[Route("init")]
        public Response Init()
        {
            HappySlotGame game = null;
            //try
            //{
            game = new HappySlotGame(new Cash(Currency.USD, 10000));
            this._repository.Add(game);

            return new SpinResponse(game.Guid)
            {
                Bet = new Cash(),
                Cash = game.Cash,
                IsWin = false,
                Multiplier = 0,
                Profit = new Cash(),
                GameField = ((Sign[][])game.GameField).Select(s => s.Select(s2 => s2.Name).ToArray()).ToArray()
            };
            // }
            // catch (Exception e)
            // {
            //     return new ErrorResponse(game?.Guid ?? Guid.Empty, e);
            // }
        }

        //[Route("spin/")]
        //[HttpGet]
        public Response Spin([BindRequired, FromQuery]Guid sessionId, [BindRequired, FromQuery]BetLevel betLevel)
        {
            var game = this._repository.GetGame(sessionId);

            var bet = new Cash(game.Cash.Currency, betLevel.GetBet());

            if (game == null)
                return new ErrorResponse(sessionId == null ? Guid.Empty : sessionId, new NullReferenceException("You are not initialize"));

            var winResponse = game.Spin(bet);

            return new SpinResponse(sessionId)
            {
                Bet = winResponse.Bet,
                Cash = game.Cash,
                IsWin = winResponse.Win,
                Multiplier = winResponse.Multiplier,
                Profit = winResponse.Profit,
                GameField = ((Sign[][])game.GameField).Select(s => s.Select(s2 => s2.Name).ToArray()).ToArray()
            };
        }
    }
}