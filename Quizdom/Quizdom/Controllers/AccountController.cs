using Quizdom.Models;
using Quizdom.Models.AccountViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Threading.Tasks;

namespace Quizdom.Controllers
{
    [Route("api/[controller]")]
    public class AccountController : Controller
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly ILogger _logger;

        public AccountController(
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            ILoggerFactory loggerFactory)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _logger = loggerFactory.CreateLogger<AccountController>();
        }

        //
        // POST: /Account/Login
        [HttpPost("Login")]
        public async Task<IActionResult> Login([FromBody]LoginViewModel model)
        {
            if (ModelState.IsValid)
            {
                var user = await _userManager.FindByEmailAsync(model.Email);

                if(user != null) 
                {
                    var result = await _signInManager.PasswordSignInAsync(user.UserName, model.Password, isPersistent: false, lockoutOnFailure: false);

                    if (result.Succeeded)
                    {
                        var authUser = await GetUser(user);

                        _logger.LogInformation(1, "User logged in.");

                        return Ok(authUser);
                    }
                }

                ModelState.AddModelError("Error", "Invalid login attempt.");
            }

            // If we got this far, something failed, redisplay form
            return BadRequest(ModelState);
        }

        //
        // POST: /Account/Register
        [HttpPost("Register")]
        public async Task<IActionResult> Register([FromBody]RegisterViewModel model)
        {
            if (ModelState.IsValid)
            {
                var user = new ApplicationUser { UserName = model.UserName, Email = model.Email };
                var result = await _userManager.CreateAsync(user, model.Password);

                if (result.Succeeded)
                {
                    await _userManager.AddToRoleAsync(user, "Normal");
                    if (user.Email.Contains("daVisionary") || user.Email.Contains("rickco"))
                    {
                        await _userManager.AddToRoleAsync(user, "Admin");
                    }
                    await _signInManager.SignInAsync(user, isPersistent: false);

                    _logger.LogInformation(3, "User created a new account with password.");

                    return Ok();
                }

                AddErrors(result);
            }

            // If we got this far, something failed
            return BadRequest(ModelState);
        }

        // api/account/veriify?username={value}&email={value}
        [HttpGet("verify")]
        public async Task<IActionResult> Verify([FromQuery]string userName, [FromQuery]string email)
        {
            var user = await _userManager.FindByNameAsync(userName);
            var userx = await _userManager.FindByEmailAsync(email);

            // TODO: COMPLETE THIS


            return NoContent();
        }

        //
        // POST: /Account/Logout
        [HttpPost("Logout")]
        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync();
            _logger.LogInformation(4, "User logged out.");

            return Ok();
        }

        #region Helpers

        private void AddErrors(IdentityResult result)
        {
            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(error.Code, error.Description);
            }
        }

        private async Task<AuthUserViewModel> GetUser(ApplicationUser user)
        {
            //var user = await _userManager.FindByNameAsync(userName);
            var roles = await _userManager.GetRolesAsync(user);

            var vm = new AuthUserViewModel()
            {
                UserName = user.UserName,
                Email = user.Email,
                AvatarUrl = user?.Avatar?.ImageUrl,
                IsAdmin = roles.Contains("Admin")
                //Email,
                //Avatar,
                //birthday,
                //socialpriviledge,
                //isPresident,
                //isAdmin,
                //friendsList,

            };

            return vm;
        }

        #endregion
    }
}
