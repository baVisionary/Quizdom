using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Quizdom.Models
{
    public class UserActivity
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public DateTime LastActivity { get; set; }
        public int GameId { get; set; }
    }
}
