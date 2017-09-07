using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Quizdom.Models
{
    public class PlayerStat
    {
        public int Id { get; set; }
        public string userName { get; set; }
        public int questionsWon { get; set; }
        public int questionsRight { get; set; }
        public int questionsRightDelay { get; set; }
    }
}
