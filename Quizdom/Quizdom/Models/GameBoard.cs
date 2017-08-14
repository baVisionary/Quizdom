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
        public int prizePoints { get; set; }
        public string questionText { get; set; }
        public string answerA { get; set; }
        public string answerB { get; set; }
        public string answerC { get; set; }
        public string answerD { get; set; }
        public string correctAnswer { get; set; }
        public int answerOrder { get; set; }
        public string difficulty { get; set; }
        public int categoryId { get; set; }
    }
}
