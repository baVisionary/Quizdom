using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Quizdom.Data;
using Quizdom.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Net;
using Quizdom.Services;
using Microsoft.AspNetCore.Authorization;

namespace Quizdom.Controllers
{
    [Route("api/quiz/")]
    public class QuizController : Controller
    {
        private ApplicationDbContext _context;
        private UserTracker userTracker;

        /* USER INFORMATION */
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly string _externalCookieScheme;

        public QuizController(ApplicationDbContext context, 
                              UserManager<ApplicationUser> userManager,
                              SignInManager<ApplicationUser> signInManager,
                              IOptions<IdentityCookieOptions> identityCookieOptions)
        {
            _context = context;
            userTracker = new UserTracker(context);
            _userManager = userManager;
            _signInManager = signInManager;
            _externalCookieScheme = identityCookieOptions.Value.ExternalCookieAuthenticationScheme;
        }


        // GET CURRENT USER INFORMATION
        [HttpGet("user")]
        public async Task<IActionResult> GetUserInformationAsync()
        {
            // UPDATE USER TRACKING INFORMATION
            userTracker.UpdateUserActivity(Request);

            var user = await GetCurrentUserAsync();
            
            if (user == null)
            {
                return NoContent();
            }
            return Ok(user);
        }

        // GET: Quizes
        [HttpGet]
        public IEnumerable<Quiz> Get()
        {
            // UPDATE USER TRACKING INFORMATION
            userTracker.UpdateUserActivity(Request);
            return _context.Quiz.ToList();
        }


        // GET api/quiz/1   - get's a specific quiz
        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
            // UPDATE USER TRACKING INFORMATION
            userTracker.UpdateUserActivity(Request);

            var record = (from c in _context.Quiz
                          where c.Id == id
                          select c).FirstOrDefault();

            if (record == null)
            {
                return NoContent();
            }

            return Ok(record);
        }

        [HttpGet("categories")]
        public IActionResult GetCategories()
        {
            // UPDATE USER TRACKING INFORMATION
            userTracker.UpdateUserActivity(Request);

            var record = (from c in _context.Quiz                          
                          select c.Category).Distinct();

            if (record == null)
            {
                return NoContent();
            }

            return Ok(record);
        }

        [HttpGet("category/{category}")]
        public IActionResult GetCategory(string category)
        {
            // UPDATE USER TRACKING INFORMATION
            userTracker.UpdateUserActivity(Request);

            var record = (from c in _context.Quiz
                          where c.Category == category
                          select c).ToList();

            if (record == null)
            {
                return NoContent();
            }

            return Ok(record);
        }

        [HttpGet("difficulty/{difficulty}")]
        public IActionResult GetDifficulty(string difficulty)
        {
            // UPDATE USER TRACKING INFORMATION
            userTracker.UpdateUserActivity(Request);

            var record = (from c in _context.Quiz
                          where c.Difficulty == difficulty
                          select c).OrderBy(c => c.Category).ToList();

            if (record == null)
            {
                return NoContent();
            }

            return Ok(record);
        }

        [HttpGet("category/{category}/difficulty/{difficulty}")]
        public IActionResult GetCategoryDifficulty(string category, string difficulty)
        {
            // UPDATE USER TRACKING INFORMATION
            userTracker.UpdateUserActivity(Request);

            var record = (from c in _context.Quiz
                          where c.Category == category 
                                && c.Difficulty == difficulty
                          select c).ToList();

            if (record == null)
            {
                return NotFound($"Quiz Category / difficulty level: {category}/{difficulty} does not exist!");
            }

            return Ok(record);
        }

        // POST api/values
        [Authorize]
        [HttpPost]
        public IActionResult Post([FromBody]Quiz quiz)
        {
            // UPDATE USER TRACKING INFORMATION
            userTracker.UpdateUserActivity(Request);

            _context.Quiz.Add(quiz);
            _context.SaveChanges();

            return Created("api/quiz/" + quiz.Id, quiz.Id);
        }

        [HttpPost("multi")]
        public void PostMulitple([FromBody]List<Quiz> quizes)
        {
            // UPDATE USER TRACKING INFORMATION
            userTracker.UpdateUserActivity(Request);

            foreach (Quiz quiz in quizes)
            {
                _context.Quiz.Add(quiz);
            }
            _context.SaveChanges();
        }

        [HttpPost("import")]
        public void Import([FromBody]List<QuizImport> quizes)
        {
            // UPDATE USER TRACKING INFORMATION
            userTracker.UpdateUserActivity(Request);

            Quiz newQuiz;
            foreach (QuizImport quiz in quizes)
            {
                newQuiz = new Quiz();
                newQuiz.Category = quiz.Category;
                newQuiz.Correct_Answer = WebUtility.HtmlDecode(quiz.Correct_Answer);
                newQuiz.Difficulty = quiz.Difficulty;
                newQuiz.Incorrect_Answer1 = WebUtility.HtmlDecode(quiz.Incorrect_Answers[0]);
                newQuiz.Incorrect_Answer2 = WebUtility.HtmlDecode(quiz.Incorrect_Answers[1]);
                newQuiz.Incorrect_Answer3 = WebUtility.HtmlDecode(quiz.Incorrect_Answers[2]);
                newQuiz.Question = WebUtility.HtmlDecode(quiz.Question);
                newQuiz.Source = "OpenTriviaDB";
                newQuiz.Type = quiz.Type;

                _context.Quiz.Add(newQuiz);
            }
            _context.SaveChanges();
            
        }
        [Authorize]
        [HttpPut("{id}")]
        public IActionResult Put(int id, [FromBody]Quiz quiz)
        {
            // UPDATE USER TRACKING INFORMATION
            userTracker.UpdateUserActivity(Request);

            string username = UserTracker.ExtractUsernameHeader(Request);

            var record2 = _context.Quiz.Where(c => c.Id == id).Count();

            var validate = userTracker.ValidateUserAccess(Request, quiz.UserId);

            if (!validate)
            {
                return Forbid();
            }

            if (record2 == 0)
            {
                return NoContent();
            }

            quiz.Id = id;            
            _context.Quiz.Update(quiz);
            _context.SaveChanges();
            return Ok(quiz);
        }

        [Authorize]
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            // UPDATE USER TRACKING INFORMATION
            userTracker.UpdateUserActivity(Request);

            var validateUserAccess = (from c in _context.Quiz
                                      where c.Id == id
                                      select c).FirstOrDefault();

            var validate = userTracker.ValidateUserAccess(Request, validateUserAccess.UserId);

            if (!validate)
            {
                return Forbid();
            }

            _context.Remove(_context.Quiz.SingleOrDefault<Quiz>(c => c.Id == id));         
            _context.SaveChanges();
            return NoContent();
        }

        private Task<ApplicationUser> GetCurrentUserAsync()
        {
            return _userManager.GetUserAsync(HttpContext.User);
        }
    }
}
