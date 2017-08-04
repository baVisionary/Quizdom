using System.ComponentModel.DataAnnotations;

namespace Quizdom.Models
{
    public class NewMessageViewModel
    {
        [Required]
        public string Chatroom { get; set; }
        public string UserName { get; set; }
        public string Content { get; set; }
    }
}