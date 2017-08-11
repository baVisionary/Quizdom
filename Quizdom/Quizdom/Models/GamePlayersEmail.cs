using System.ComponentModel.DataAnnotations.Schema;

namespace Quizdom.Models
{
    public class GamePlayersEmail
    {
        public int Id { get; set; }

        [ForeignKey("Game")]
        public int gameId { get; set; }

        public Game Game1 { get; set; }

        public string userEmail { get; set; }
    }
}
