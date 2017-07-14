using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Quizdom.Models
{
    public class GameBoard
    {
        public int Id { get; set; }
        public int gameId { get; set; }
        public int boardColumn { get; set; }
        public int boardRow { get; set; }
        public int questionId { get; set; }
        public string questionState { get; set; }
        public string answeredCorrectlyUserId { get; set; }
    }
}
