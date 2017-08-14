using System.ComponentModel.DataAnnotations.Schema;

namespace Quizdom.Models
{
    public class GamePlayers
    {
        public int Id { get; set; }

        [ForeignKey("Game")]
        public int gameId { get; set; }

        public Game Game { get; set; }

        public string userId { get; set; }
        public bool initiator { get; set; }
        public int prizePoints { get; set; }
    }
}
