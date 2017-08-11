using System.ComponentModel.DataAnnotations.Schema;

namespace Quizdom.Models
{
    public class GameBoard
    {
        public int Id { get; set; }

        [ForeignKey("Game")]
        public int gameId { get; set; }

        public Game Game { get; set; }

        public int boardColumn { get; set; }
        public int boardRow { get; set; }
        public int questionId { get; set; }
        public string questionState { get; set; }
        public string answeredCorrectlyUserId { get; set; }
    }
}
