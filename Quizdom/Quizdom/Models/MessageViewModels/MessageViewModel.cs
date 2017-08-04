using System;
using System.ComponentModel.DataAnnotations;

namespace Quizdom.Models
{
    // This is the model for the JSON data that we send to the client
    // for each message. We are not sending back the actual "Message" object
    // to the client because we are not wanting to send back all of the data
    // about the ApplicationUser who authored the message. This allows us to
    // return only the UserName of the ApplicationUser who wrote the message.
    public class MessageViewModel
    {
        [Required]
        public string Content { get; set; }

        [Required]
        public string UserName { get; set; }

        [Required]
        [DataType(DataType.Date)]
        public DateTime Timestamp { get; set; }

        public MessageViewModel()
        {
        }

        public MessageViewModel(Message message)
        {
            Content = message.Content;
            UserName = message.UserName;
            Timestamp = message.DateCreated;
        }
    }
}