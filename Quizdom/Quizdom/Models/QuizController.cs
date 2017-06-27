using Microsoft.AspNetCore.Mvc;
using Quizdom.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Quizdom.Models
{
    [Route("api/quiz/")]
    public class QuizController : Controller
    {
        private ApplicationDbContext _context;

        public QuizController(ApplicationDbContext context)
        {
            _context = context;
        }


        // GET: Quizes
        [HttpGet]
        public IEnumerable<Quiz> Get()
        {
            return _context.Quiz.ToList();
        }


        // GET api/quiz/1   - get's a specific quiz
        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
            var record = (from c in _context.Quiz
                          where c.Id == id
                          select c).FirstOrDefault();

            if (record == null)
            {
                return NotFound($"Quiz #{id} does not exist!");
            }

            return Ok(record);
        }

        [HttpGet("category/{category}")]
        public IActionResult GetCategory(string category)
        {
            var record = (from c in _context.Quiz
                          where c.Category == category
                          select c).ToList();

            if (record == null)
            {
                return NotFound($"Quiz Category {category} does not exist!");
            }

            return Ok(record);
        }

        [HttpGet("difficulty/{difficulty}")]
        public IActionResult GetDifficulty(string difficulty)
        {
            var record = (from c in _context.Quiz
                          where c.Difficulty == difficulty
                          select c).OrderBy(c => c.Category).ToList();

            if (record == null)
            {
                return NotFound($"Quiz difficulty level {difficulty} does not exist!");
            }

            return Ok(record);
        }

        [HttpGet("category/{category}/difficulty/{difficulty}")]
        public IActionResult GetCategoryDifficulty(string category, string difficulty)
        {
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
        [HttpPost]
        public void Post([FromBody]Quiz quiz)
        {
            _context.Quiz.Add(quiz);
            _context.SaveChanges();
        }

        [HttpPost("multi")]
        public void PostMulitple([FromBody]List<Quiz> quizes)
        {
            foreach (Quiz quiz in quizes)
            {
                _context.Quiz.Add(quiz);
            }
            _context.SaveChanges();
        }

        [HttpPost("import")]
        public void Import([FromBody]List<QuizImport> quizes)
        {
            Quiz newQuiz;
            foreach (QuizImport quiz in quizes)
            {
                newQuiz = new Quiz();
                newQuiz.Category = quiz.Category;
                newQuiz.Correct_Answer = quiz.Correct_Answer;
                newQuiz.Difficulty = quiz.Difficulty;
                newQuiz.Incorrect_Answer1 = quiz.Incorrect_Answers[0];
                newQuiz.Incorrect_Answer2 = quiz.Incorrect_Answers[1];
                newQuiz.Incorrect_Answer3 = quiz.Incorrect_Answers[2];
                newQuiz.Question = quiz.Question;
                newQuiz.Source = "OpenTriviaDB";
                newQuiz.Type = quiz.Type;

                _context.Quiz.Add(newQuiz);
            }
            _context.SaveChanges();
        }
    }
}
