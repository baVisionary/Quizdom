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
        public string AvatarUrl { get; set; }
        public bool IsAdmin { get; set; }
    }
}
