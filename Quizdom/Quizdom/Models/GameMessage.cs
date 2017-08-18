using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Quizdom.Models
{
    public class GameMessage
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        public string Content { get; set; }

        [Required]
        [Timestamp]
        public DateTime DateCreated { get; set; }

        //public ApplicationUser User { get; set; }    

        [Required]
        public string UserName { get; set; }

        [ForeignKey("Game")]
        public int GameId { get; set; }

        public Game Game { get; set; }
    }
}