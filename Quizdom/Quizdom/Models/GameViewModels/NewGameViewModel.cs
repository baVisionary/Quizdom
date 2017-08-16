using System.ComponentModel.DataAnnotations;

namespace Quizdom.Models
{
    public class NewGameViewModel
    {
        [Required]
        public string Content { get; set; }

        [Required]
        public string UserName { get; set; }

        public string Group { get; set; }

        public int GameId { get; set; }
    }
}