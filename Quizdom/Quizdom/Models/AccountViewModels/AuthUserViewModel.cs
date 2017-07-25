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

    }
}
