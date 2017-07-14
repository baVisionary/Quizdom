//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Threading.Tasks;

//namespace Quizdom.Models
//{
//    public class GameResponse
//    {
//        public int Id { get; set; }
//        public DateTime startDateTime { get; set; }
//        public string Initiator_UserId { get; set; }
//        public List<string> InvitedUserEmails { get; set; }
//        public List<string> Categories { get; set; }
//        public List<string> Questions { get; set; }
//        public int? GameLength { get; set; }
//        public string QuestionsState { get; set; }
//        public string LastActiveUserId { get; set; }
//        public string ActiveUserId { get; set; }
//        public List<string> Players { get; set; }

//        public GameResponse(Game game)
//        {
//            Id = game.Id;
//            startDateTime = game.startDateTime;
//            Initiator_UserId = game.Initiator_UserId;
//            InvitedUserEmails = ConvertStringToArray(game.InvitedUserEmails);
//            Categories = ConvertStringToArray(game.Categories);
//            Questions = ConvertStringToArray(game.Questions);
//            GameLength = game.GameLength;
//            QuestionsState = game.QuestionsState;
//            LastActiveUserId = game.LastActiveUserId;
//            ActiveUserId = game.ActiveUserId;
//            Players = ConvertStringToArray(game.Players);
//        }

//        private List<string> ConvertStringToArray(string array)
//        {
//            return new List<string> ( array.Split(',').ToArray<string>() );
//        }
//    }
//}
