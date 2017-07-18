using System;
using System.ComponentModel.DataAnnotations;

namespace Quizdom.Models.MessageViewModel
{
    public class NewMessageViewModel
    {
        [Required]
        public string Content { get; set; }
    }
}


// XHR request
// { "content": "Whatever the message is!" }