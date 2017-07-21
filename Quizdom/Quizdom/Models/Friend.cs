using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Quizdom.Models
{
    public class Friend
    {
        public int Id { get; set; }
        public string primaryUserName { get; set; }
        public string friendUserName { get; set; }
    }
}
