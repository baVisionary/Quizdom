using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Quizdom.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Net;

namespace Quizdom.Models
{
    [Route("api/game/")]
    public class GameController : Controller
    {
        private ApplicationDbContext _context;


        public GameController(ApplicationDbContext context)
        {
            _context = context;
        }


        // GET: /api/game
        [HttpGet]
        public IEnumerable<Game> Get()
        {
            return _context.Games.ToList();

            //// RETURN JSON ARRAY FROM STRING FIELDS
            //List<Game> games = _context.Games.ToList();
            //List<GameResponse> gameResponse = new List<GameResponse>();
            //foreach(Game game in games)
            //{
            //    gameResponse.Add(new GameResponse(game));
            //}

            //return gameResponse;
        }

        // GET /api/game/1   - get's a specific game
        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
            var record = (from c in _context.Games
                          where c.Id == id
                          select c).FirstOrDefault();

            if (record == null)
            {
                return NotFound($"Game #{id} does not exist!");
            }

            return Ok(record);
        }


        // POST /api/game
        [HttpPost]
        public void Post([FromBody]Game game)
        {
            _context.Games.Add(game);
            _context.SaveChanges();
        }

        // PUT /api/game/1   ** updates game record by game id
        [HttpPut("{id}")]
        public IActionResult Put(int id, [FromBody]Game games)
        {

            var record2 = _context.Games.Where(c => c.Id == id).Count();


            if (record2 == 0)
            {
                return NotFound($"Game #{id} does not exist!");
            }

            games.Id = id;
            _context.Games.Update(games);
            _context.SaveChanges();
            return Ok();
        }

        // DELETE /api/game/1
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            _context.Remove(_context.Games.SingleOrDefault<Game>(c => c.Id == id));
            _context.SaveChanges();
            return NoContent();
        }


        // POST /api/game/email  ** Add new gameplayers email record
        [HttpPost("email")]
        public void Post([FromBody]GamePlayersEmail gamePlayersEmail)
        {
            _context.GamePlayersEmail.Add(gamePlayersEmail);
            _context.SaveChanges();
        }

        // GET: /api/game/email  * get's all game players Email
        [HttpGet("email")]
        public IEnumerable<GamePlayersEmail> GamePlayersEmail()
        {
            return _context.GamePlayersEmail.ToList();
        }

        // PUT /api/game/email   ** updates gamePlayersEmail record by id
        [HttpPut("email/{id}")]
        public IActionResult PutEmail(int id, [FromBody]GamePlayersEmail email)
        {

            var record2 = _context.GamePlayersEmail.Where(c => c.Id == id).Count();


            if (record2 == 0)
            {
                return NotFound($"GamePlayerEmail ID: #{id} does not exist!");
            }

            email.Id = id;
            _context.GamePlayersEmail.Update(email);
            _context.SaveChanges();
            return Ok();
        }

        // DELETE /api/game/email/1  ** Delete GamePlayersEmail record by id
        [HttpDelete("email/{id}")]
        public IActionResult DeleteEmail(int id)
        {
            _context.Remove(_context.GamePlayersEmail.SingleOrDefault<GamePlayersEmail>(c => c.Id == id));
            _context.SaveChanges();
            return NoContent();
        }

        // GET: /api/game/players  * get's all game players
        [HttpGet("players")]
        public IEnumerable<GamePlayers> Gameplayers()
        {
            return _context.GamePlayers.ToList();
        }

        // GET /api/game/players/1   - get's all records for a specific game Id
        [HttpGet("players/{gameId}")]
        public IActionResult GetPlayersByGameId(int gameId)
        {
            var record = (from c in _context.GamePlayers
                          where c.gameId == gameId
                          select c).ToList();

            if (record == null)
            {
                return NotFound($"Game #{gameId} does not exist!");
            }

            return Ok(record);
        }

        // GET /api/game/players/1/count   - get's a count of players for a specified game
        [HttpGet("players/{gameId}/count")]
        public IActionResult GetPlayersByGameIdCount(int gameId)
        {
            var record = (from c in _context.GamePlayers
                          where c.gameId == gameId
                          select c).Count();

            if (record == 0)
            {
                return NotFound($"Game #{gameId} does not exist!");
            }

            return Ok(record);
        }

        // POST /api/game/players  ** Add new gameplayers record
        [HttpPost("players")]
        public void Post([FromBody]GamePlayers gamePlayers)
        {
            _context.GamePlayers.Add(gamePlayers);
            _context.SaveChanges();
        }

        // PUT /api/game/players1   ** updates gamePlayers record by id
        [HttpPut("players/{id}")]
        public IActionResult Put(int id, [FromBody]GamePlayers player)
        {

            var record2 = _context.GamePlayers.Where(c => c.Id == id).Count();


            if (record2 == 0)
            {
                return NotFound($"Player #{id} does not exist!");
            }

            player.Id = id;
            _context.GamePlayers.Update(player);
            _context.SaveChanges();
            return Ok();
        }

        // DELETE /api/game/players/1  ** Delete GamePlayers record by id
        [HttpDelete("players/{id}")]
        public IActionResult DeletePlayers(int id)
        {
            _context.Remove(_context.GamePlayers.SingleOrDefault<GamePlayers>(c => c.Id == id));
            _context.SaveChanges();
            return NoContent();
        }


        // GET: /api/game/board  * get's all game board
        [HttpGet("board")]
        public IEnumerable<GameBoard> GetBoard()
        {
            return _context.GameBoards.ToList();
        }

        // GET /api/game/board/1   - get's all records for a specific game Id
        [HttpGet("board/{gameId}")]
        public IActionResult GetBoardByGameId(int gameId)
        {
            var record = (from c in _context.GameBoards
                          where c.gameId == gameId
                          select c).ToList();

            if (record == null)
            {
                return NotFound($"Game #{gameId} does not exist!");
            }

            return Ok(record);
        }

        // GET /api/game/players/1/count   - get's a number of players for a specified game
        [HttpGet("board/{gameId}/count")]
        public IActionResult GetQuestionsByGameIdCount(int gameId)
        {
            var record = (from c in _context.GameBoards
                          where c.gameId == gameId
                          select c).Count();

            if (record == 0)
            {
                return NotFound($"Game #{gameId} does not exist!");
            }

            return Ok(record);
        }

        // POST /api/game/board  ** Add new gameboard record
        [HttpPost("board")]
        public void Post([FromBody]GameBoard gameBoard)
        {
            _context.GameBoards.Add(gameBoard);
            _context.SaveChanges();
        }

        // PUT /api/game/board/1   ** updates gameBpard record by id
        [HttpPut("board/{id}")]
        public IActionResult PutBoard(int id, [FromBody]GameBoard gameBoard)
        {

            var record2 = _context.GameBoards.Where(c => c.Id == id).Count();


            if (record2 == 0)
            {
                return NotFound($"Gameboard #{id} does not exist!");
            }

            gameBoard.Id = id;
            _context.GameBoards.Update(gameBoard);
            _context.SaveChanges();
            return Ok();
        }

        // DELETE /api/game/board/1  ** Delete GameBoard record by id
        [HttpDelete("board/{id}")]
        public IActionResult DeleteBoard(int id)
        {
            _context.Remove(_context.GameBoards.SingleOrDefault<GameBoard>(c => c.Id == id));
            _context.SaveChanges();
            return NoContent();
        }

        // GET: /api/game/gameCategories * get's all gamecategories
        [HttpGet("gamecategories")]
        public IEnumerable<GameCategories> GameCategories()
        {
            return _context.GameCategories.ToList();
        }

        // POST /api/game/gamecategories  ** Add new GameCategories record
        [HttpPost("gamecategories")]
        public void PostGameCategories([FromBody]GameCategories GameCategories)
        {
            _context.GameCategories.Add(GameCategories);
            _context.SaveChanges();
        }

        // PUT /api/game/gamecategories/1   ** updates gameBpard record by id
        [HttpPut("gamecategories/{id}")]
        public IActionResult PutGameCategories(int id, [FromBody]GameCategories GameCategories)
        {
            var record2 = _context.GameCategories.Where(c => c.Id == id).Count();


            if (record2 == 0)
            {
                return NotFound($"GameCategories ID: #{id} does not exist!");
            }

            GameCategories.Id = id;
            _context.GameCategories.Update(GameCategories);
            _context.SaveChanges();
            return Ok();
        }

        // DELETE /api/game/gamecategories/1  ** Delete GameCategories record by id
        [HttpDelete("gamecategories/{id}")]
        public IActionResult DeleteGameCategories(int id)
        {
            _context.Remove(_context.GameCategories.SingleOrDefault<GameCategories>(c => c.Id == id));
            _context.SaveChanges();
            return NoContent();
        }

        // GET: /api/game/avatar * get's all avatars
        [HttpGet("avatar")]
        public IEnumerable<Avatar> Avatar()
        {
            return _context.Avatars.ToList();
        }

        // POST /api/game/avatar  ** Add new GameCategories record
        [HttpPost("avatar")]
        public void PostAvatar([FromBody]Avatar Avatar)
        {
            _context.Avatars.Add(Avatar);
            _context.SaveChanges();
        }

        // PUT /api/game/avatar/1   ** updates avatar record by id
        [HttpPut("avatar/{id}")]
        public IActionResult PutAvatar(int id, [FromBody]Avatar Avatar)
        {
            var record2 = _context.Avatars.Where(c => c.Id == id).Count();


            if (record2 == 0)
            {
                return NotFound($"Avatar ID: #{id} does not exist!");
            }

            Avatar.Id = id;
            _context.Avatars.Update(Avatar);
            _context.SaveChanges();
            return Ok();
        }

        // DELETE /api/game/avatar/1  ** Delete avatar record by id
        [HttpDelete("avatar/{id}")]
        public IActionResult DeleteAvatar(int id)
        {
            _context.Remove(_context.Avatars.SingleOrDefault<Avatar>(c => c.Id == id));
            _context.SaveChanges();
            return NoContent();
        }



        // GET: /api/game/categories * get's all categories
        [HttpGet("categories")]
        public IEnumerable<Category> Category()
        {
            return _context.Categories.ToList();
        }

        // POST /api/game/categories  ** Add new category record
        [HttpPost("categories")]
        public void PostCategory([FromBody]Category Category)
        {
            _context.Categories.Add(Category);
            _context.SaveChanges();
        }

        // PUT /api/game/categories/1   ** updates category record by id
        [HttpPut("categories/{id}")]
        public IActionResult PutCategory(int id, [FromBody]Category Category)
        {
            var record2 = _context.Categories.Where(c => c.Id == id).Count();


            if (record2 == 0)
            {
                return NotFound($"Category ID: #{id} does not exist!");
            }

            Category.Id = id;
            _context.Categories.Update(Category);
            _context.SaveChanges();
            return Ok();
        }

        // DELETE /api/game/categories/1  ** Delete avatar record by id
        [HttpDelete("categories/{id}")]
        public IActionResult DeleteCategory(int id)
        {
            _context.Remove(_context.Categories.SingleOrDefault<Category>(c => c.Id == id));
            _context.SaveChanges();
            return NoContent();
        }









    }
}
