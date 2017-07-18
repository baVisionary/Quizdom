using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Quizdom.Models
{
    public class Message
    {
        [Key]
        public int MessageId { get; set; }

        [Required]
        public string Content { get; set; }

        [Required]
        [ForeignKeyAttribute("User")]
        public string UserId { get; set; }

        public ApplicationUser User { get; set; }

        [Required]
        [DataType(DataType.Date)]
        //[DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime DateCreated { get; set; }

        public Message()
        {
            DateCreated = DateTime.UtcNow;
        }
    }
}
