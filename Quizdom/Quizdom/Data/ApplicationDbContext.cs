using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Quizdom.Models;

namespace Quizdom.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            // Customize the ASP.NET Identity model and override the defaults if needed.
            // For example, you can rename the ASP.NET Identity table names and more.
            // Add your customizations after calling base.OnModelCreating(builder);
        }

        public DbSet<Quiz> Quiz { get; set; }
        public DbSet<Avatar> Avatars { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Game> Games { get; set; }
        public DbSet<GamePlayers> GamePlayers { get; set; }
        public DbSet<GamePlayersEmail> GamePlayersEmail { get; set; }
        public DbSet<GameBoard> GameBoards { get; set; }
        public DbSet<GameCategories> GameCategories { get; set; }
        public DbSet<Friend> Friends { get; set; }
        public DbSet<UserActivity> UserActivity { get; set; }


    }
}
