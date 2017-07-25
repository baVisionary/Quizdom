﻿using Quizdom.Models;
using Quizdom.Models.AccountViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Threading.Tasks;
using System;
using System.Collections.Generic;
using Quizdom.Data;
using System.Linq;

namespace Quizdom.Controllers
{
    [Route("api/[controller]")]
    public class AccountController : Controller
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly ILogger _logger;

        private ApplicationDbContext _context;

        public AccountController(
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            ILoggerFactory loggerFactory,
            ApplicationDbContext context)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _logger = loggerFactory.CreateLogger<AccountController>();
            _context = context;
        }

        //
        // POST: /Account/Login
        [HttpPost("Login")]
        public async Task<IActionResult> Login([FromBody]LoginViewModel model)
        {
            if (ModelState.IsValid)
            {
                var user = await _userManager.FindByEmailAsync(model.Email);

                if (user != null)
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
                var user = new ApplicationUser { UserName = model.UserName, Email = model.Email, AvatarId = model.AvatarId };
                var result = await _userManager.CreateAsync(user, model.Password);

                if (result.Succeeded)
                {
                    await _userManager.AddToRoleAsync(user, "Normal");
                    if (user.UserName.ToUpper().Equals("DAVISIONARY") || user.UserName.ToUpper().Equals("RICKCO"))
                    {
                        await _userManager.AddToRoleAsync(user, "Admin");
                    }
                    await _signInManager.SignInAsync(user, isPersistent: false);

                    _logger.LogInformation(3, "User created a new account with password.");

                    var authUser = await GetUser(user);

                    return Ok(authUser);
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
            if (user == null && userx == null)
            {
                return Ok(true);
            }

            return Ok(false);
        }

        // api/account/searchuserbyname?username={value}
        [HttpGet("searchuserbyname")]
        public async Task<IActionResult> SearchUserByName([FromQuery]string userName)
        {

            var user = await _userManager.FindByNameAsync(userName);
            if (user == null)
            {
                return NotFound($"Username {userName} was not found");
            }

            var authUser = await GetUser(user);
            return Ok(authUser);
        }

        // api/account/searchuserbyemail?email={value}
        [HttpGet("searchuserbyemail")]
        public async Task<IActionResult> SearchUserByEmail([FromQuery]string email)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
            {
                return NotFound($"Email Address: {email} was not found");
            }
            var authUser = await GetUser(user);

            return Ok(authUser);
        }

        // api/account/getfriendsbyprimaryusername?username={value}
        [HttpGet("getfriendsbyprimaryusername")]
        public async Task<IActionResult> SearchUserByPrimaryUserName([FromQuery]string userName)
        {
            List<AuthUserViewModel> authModel = new List<AuthUserViewModel>();
            var unregisteredUsers = 0;

            var record = (from c in _context.Friends
                          where c.primaryUserName == userName
                          select c).Distinct().ToList();

            if (record.Count > 0)
            {
                var authUser = new AuthUserViewModel();

                foreach (var item in record)
                {
                    try
                    {
                        var user = await _userManager.FindByNameAsync(item.friendUserName);
                        authUser = await GetUser(user);
                        authUser.FriendId = item.Id;
                        authModel.Add(authUser);
                    }
                    catch
                    {
                        unregisteredUsers++;
                    }
                }

                if (authModel.Count() > 0)
                    return Ok(authModel);

                return NotFound("No Registered Users were located!");
            }
            return NotFound($"No Results Found for Primary User: {userName}");
        }


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
                AvatarId = user.AvatarId,
                IsAdmin = roles.Contains("Admin")
                //Email,
                //Avatar,
                //birthday,
                //socialpriviledge,
                //isPresident,
                //friendsList,

            };

            return vm;
        }

        #endregion
    }
}
