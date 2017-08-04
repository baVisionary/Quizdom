using Quizdom.Data;
using Quizdom.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Quizdom.Services
{
    public class PlayerService
    {
        private ApplicationDbContext dbContext;

        public PlayerService(ApplicationDbContext context)
        {
            dbContext = context;
        }

        public async Task<IEnumerable<Message>> GetActivePlayers()
        {
            return await dbContext.Message.Include(m => m.User).ToArrayAsync();
        }

        public async Task<Message> SavePlayerActivity(Message message)
        {
            await dbContext.AddAsync(message);
            await dbContext.SaveChangesAsync();

            return message;
        }

        public void LogoutPlayer()
        {

        }

        public void TimeoutPlayer()
        {

        }
    }
}