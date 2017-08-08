using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Quizdom.Data;
using Quizdom.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Quizdom.Services
{
    public class PlayerService
    {
        private ApplicationDbContext dbContext;
        private readonly SignInManager<ApplicationUser> _signInManager;

        public PlayerService(UserManager<ApplicationUser> userManager, ApplicationDbContext context, SignInManager<ApplicationUser> signInManager)
        {
            dbContext = context;
            _signInManager = signInManager;
        }

        public async Task<IEnumerable<UserActivity>> GetActivePlayers()
        {            
            return await dbContext.UserActivity.ToArrayAsync();         
        }

        public async Task<UserActivity> SavePlayerActivity(UserActivity useractivity)
        {            
            await dbContext.AddAsync(useractivity);
            await dbContext.SaveChangesAsync();

            return useractivity;
        }


        public async void LogoutPlayer()
        {
            await _signInManager.SignOutAsync();            
        }

        public void TimeoutPlayer()
        {

        }
    }
}