using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR.Infrastructure;
using Microsoft.EntityFrameworkCore;
using Quizdom.Controllers;
using Quizdom.Data;
using Quizdom.Hubs;
using Quizdom.Models;
using Quizdom.Models.MessagesViewModel;
using Quizdom.Models.MessageViewModel;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Chatazon.Controllers
{
    [Produces("application/json")]
    public class ChatroomController : ApiHubController<Broadcaster>
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private ApplicationDbContext _context;

        public ChatroomController(UserManager<ApplicationUser> userManager, ApplicationDbContext ctx, IConnectionManager connectionManager)
        : base(connectionManager)
        {
            _userManager = userManager;
            _context = ctx;
        }

        private Task<ApplicationUser> GetCurrentUserAsync() => _userManager.GetUserAsync(HttpContext.User);

        [HttpGet]
        [Route("[controller]")]
        public async Task<IActionResult> Get()
        {
            Message[] messages = await _context.Message.Include(m => m.User).ToArrayAsync();
            List<MessageViewModel> model = new List<MessageViewModel>();

            foreach (Message msg in messages)
            {
                model.Add(new MessageViewModel(msg));
            }

            return Json(model);
        }

        [HttpPost]
        [Authorize]
        [Route("[controller]")]
        public async Task<IActionResult> Post([FromBody]NewMessageViewModel message)
        {
            if (ModelState.IsValid)
            {
                // Get the current user
                var user = await GetCurrentUserAsync();

                // Create a new message to save to the database
                Message newMessage = new Message()
                {
                    Content = message.Content,
                    UserId = user.Id,
                    User = user
                };

                // Save the new message
                await _context.AddAsync(newMessage);

                await _context.SaveChangesAsync();

                MessageViewModel model = new MessageViewModel(newMessage);

                // Call the client method 'addChatMessage' on all clients in the
                // "MainChatroom" group.
                this.Clients.Group("MainChatroom").AddChatMessage(model);
                return new NoContentResult();
            }
            return BadRequest(ModelState);
        }
    }
}

