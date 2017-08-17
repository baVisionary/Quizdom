using Quizdom.Data;
using Quizdom.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Quizdom.Services
{
    public class GameService
    {
        private ApplicationDbContext dbContext;

        public GameService(ApplicationDbContext context)
        {
            dbContext = context;
        }

        public async Task<IEnumerable<GameMessage>> GetGameMessages(int gameid)
        {
            //return await dbContext.Message.Include(m => m.User).ToArrayAsync();

            return await dbContext.GameMessage.ToArrayAsync();
        }

        public async Task<GameMessage> SaveMessage(GameMessage message)
        {
            await dbContext.AddAsync(message);
            await dbContext.SaveChangesAsync();

            return message;
        }
    }
}
