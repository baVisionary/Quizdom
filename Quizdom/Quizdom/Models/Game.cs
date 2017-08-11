using System;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Quizdom.Models
{
    public class Game
    {
        public Game() { }

        public int Id { get; set; }
        public DateTime startDateTime { get; set; }
        public string initiatorUserId { get; set; }
        public int gameLength { get; set; }
        public string lastActiveUserId { get; set; }
        public string activeUserId { get; set; }

        //public Game()
        //{ }

        //public Game(GameResponse game)
        //{
        //    startDateTime = game.startDateTime;
        //    Initiator_UserId = game.Initiator_UserId;
        //    InvitedUserEmails = ConvertArrayToString(game.InvitedUserEmails);
        //    Categories = ConvertArrayToString(game.Categories);
        //    Questions = ConvertArrayToString(game.Questions);
        //    GameLength = game.GameLength;
        //    QuestionsState = game.QuestionsState;
        //    LastActiveUserId = game.LastActiveUserId;
        //    ActiveUserId = game.ActiveUserId;
        //    Players = ConvertArrayToString(game.Players);
        //}

        //private string ConvertArrayToString(List<string> array)
        //{
        //    string result = "";
        //    for(int i = 0; i < array.Count; i ++)
        //    {
        //        result += array[i];
        //        if(i < array.Count)
        //        {
        //            result += ",";
        //        }
        //    }
        //    return result;
        //}
    }
}
