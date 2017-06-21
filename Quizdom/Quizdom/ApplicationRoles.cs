using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using System.Linq;

namespace Quizdom
{
    public class ApplicationRoles
    {
        private RoleManager<IdentityRole> roleManager;

        public ApplicationRoles(RoleManager<IdentityRole> roleManager)
        {
            this.roleManager = roleManager;
        }

        public void CreateRoles()
        {
            GenerateRole("Admin");
            GenerateRole("Normal");
        }

        private void GenerateRole(string roleName)
        {
            var hasRole = roleManager.Roles.FirstOrDefault(x => x.NormalizedName.Equals(roleName.ToUpperInvariant()));
            if (hasRole == null)
            {
                roleManager.CreateAsync(new IdentityRole(roleName)).Wait();
            }
        }
    }
}