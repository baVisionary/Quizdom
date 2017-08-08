using System.ComponentModel.DataAnnotations;

namespace Quizdom.Models
{
    public class NewMessageViewModel
    {
        [Required]
        public string Content { get; set; }

        [Required]
        public string UserName { get; set; }

        public string Group { get; set; }
    }
}