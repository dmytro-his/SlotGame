using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using SlotGame.Model;
using SlotGameService.Infrastructure;
using SlotGameService.Models;

namespace SlotGameService.Controllers
{
    //[EnableCors()]
    public class SlotGameController : Controller
    {
        readonly IHappySlotsRepository _repository;

        public SlotGameController(IHappySlotsRepository repository)
        {
            this._repository = repository;
        }

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
                SignsWinStatus = game.GameField.SignsWinStatus,
                Multiplier = 0,
                Profit = new Cash(),
                GameField = (SignName[][])game.GameField
            };
            // }
            // catch (Exception e)
            // {
            //     return new ErrorResponse(game?.Guid ?? Guid.Empty, e);
            // }
        }
        
        //[HttpPost]
        public Response Spin(Guid sessionId, decimal bet)
        {
            var game = this._repository.GetGame(sessionId);

            var betCash = new Cash(game.Cash.Currency, bet);

            if (game == null)
                return new ErrorResponse(sessionId == null ? Guid.Empty : sessionId, new NullReferenceException("You are not initialize"));

            try
            {
                var winResponse = game.Spin(betCash);

                return new SpinResponse(sessionId)
                {
                    Bet = winResponse.Bet,
                    Cash = game.Cash,
                    IsWin = winResponse.Win,
                    SignsWinStatus = game.GameField.SignsWinStatus,
                    Multiplier = winResponse.Multiplier,
                    Profit = winResponse.Profit,
                    GameField = (SignName[][])game.GameField
                };
            }
            catch(GameException e)
            {
                return new SpinResponse(sessionId)
                {
                    Bet =betCash,
                    Cash = game.Cash,
                    IsWin = false,
                    SignsWinStatus = game.GameField.SignsWinStatus,
                    Multiplier = 0,
                    Profit = new Cash(),
                    GameField = (SignName[][])game.GameField
                };
            }

        }


        public Response GetCurrentState([BindRequired, FromQuery]Guid sessionId)
        {
            var game = this._repository.GetGame(sessionId);

            if (game == null)
                return new ErrorResponse(sessionId == null ? Guid.Empty : sessionId, new NullReferenceException("You are not initialize"));

            var winResponse = game.HistoryOfSpins.Last();

            return new SpinResponse(sessionId)
            {
                Bet = winResponse.Bet,
                Cash = game.Cash,
                IsWin = winResponse.Win,
                SignsWinStatus = game.GameField.SignsWinStatus,
                Multiplier = winResponse.Multiplier,
                Profit = winResponse.Profit,
                GameField = (SignName[][])game.GameField
            };
        }
    }
}