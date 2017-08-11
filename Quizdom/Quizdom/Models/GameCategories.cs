using System.ComponentModel.DataAnnotations.Schema;

namespace Quizdom.Models
{
    public class GameCategories
    {
        public int Id { get; set; }

        [ForeignKey("Game")]
        public int gameId { get; set; }

        public Game Game { get; set; }

        public int categoryId { get; set; }
    }
}
