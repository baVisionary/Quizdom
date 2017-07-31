using Quizdom.Data;
using Quizdom.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Quizdom.Services
{
    public class ChatService
    {
        private ApplicationDbContext dbContext;

        public ChatService(ApplicationDbContext context)
        {
            dbContext = context;
        }

        public async Task<IEnumerable<Message>> GetAllMessages()
        {
            return await dbContext.Message.Include(m => m.User).ToArrayAsync();
        }

        public async Task<Message> SaveMessage(Message message)
        {
            await dbContext.AddAsync(message);
            await dbContext.SaveChangesAsync();

            return message;
        }
    }
}
