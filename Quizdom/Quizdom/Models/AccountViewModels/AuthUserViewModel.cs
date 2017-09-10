using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Quizdom.Models.AccountViewModels
{
    public class AuthUserViewModel
    {
        public string UserName { get; set; }
        public string Email { get; set; }
        public int AvatarId { get; set; }
        public bool IsAdmin { get; set; }
        public int FriendId { get; set; }
        public string AvatarUrl { get; set; }
        public int questionsWon { get; set; }
        public int questionsRight { get; set; }
        public int questionsRightDelay { get; set; }
        public int gamesPlayed { get; set; }
        public int gamesWon { get; set; }
    }
}
