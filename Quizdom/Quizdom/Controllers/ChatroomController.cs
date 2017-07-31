using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.SignalR.Infrastructure;
using Microsoft.AspNetCore.SignalR.Server;
using Quizdom.Data;
using Quizdom.Models;
using Quizdom.Hubs;
using Quizdom.Services;

namespace Quizdom.Controllers
{
    public class ChatroomController : HubController<Broadcaster>
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private ChatService _chatService;

        public ChatroomController(
                UserManager<ApplicationUser> userManager,
                ChatService chatService,
                IConnectionManager connectionManager)
            : base(connectionManager)
        {
            _userManager = userManager;
            _chatService = chatService;
        }

        private async Task<ApplicationUser> GetCurrentUserAsync() => await _userManager.GetUserAsync(User);

        [HttpGet]
        [Route("[controller]")]
        public async Task<IActionResult> Get()
        {
            var messages = await _chatService.GetAllMessages();

            if (messages == null)
            {
                return StatusCode(500, "Received a null respose from Chat Service");
            }

            return Ok(messages.Select(x => new MessageViewModel(x)));
        }

        [Authorize]
        [HttpPost]
        [Route("[controller]")]
        public async Task<IActionResult> Post([FromBody]NewMessageViewModel message)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Get the current user
            var user = await GetCurrentUserAsync();

            // Create a new message to save to the database
            var newMessage = new Message()
            {
                Content = message.Content,
                UserId = user.Id,
                User = user
            };

            var record = await _chatService.SaveMessage(newMessage);

            // Call the client method 'addChatMessage' on all clients in the "MainChatroom" group.
            this.Clients.Group("MainChatroom").AddChatMessage(new MessageViewModel(record));

            return new NoContentResult();
        }
    }
}