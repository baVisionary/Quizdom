using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Quizdom.Models
{
    public class GamePlayers
    {
        public int Id { get; set; }
        public int gameId { get; set; }
        public string userId { get; set; }
        public bool initiator { get; set; }
    }
}
