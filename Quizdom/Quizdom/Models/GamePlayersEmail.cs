using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Quizdom.Models
{
    public class GamePlayersEmail
    {
        public int Id { get; set; }
        public int gameId { get; set; }
        public string userEmail { get; set; }
    }
}
