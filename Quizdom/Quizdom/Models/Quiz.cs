using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Quizdom.Models
{
    public class Quiz
    {
        public int Id { get; set; }
        public string Category { get; set; }
        public string Type { get; set; }
        public string Difficulty { get; set; }
        public string Question { get; set; }
        public string Correct_Answer { get; set; }
        public string Incorrect_Answer1 { get; set; }
        public string Incorrect_Answer2 { get; set; }
        public string Incorrect_Answer3 { get; set; }
        public string Incorrect_Answer4 { get; set; }
        public string Source { get; set; }
        public DateTime DateModified { get; set; } = DateTime.UtcNow;
        public string UserId { get; set; }
        public int? AvatarId { get; set; }
    }
}
