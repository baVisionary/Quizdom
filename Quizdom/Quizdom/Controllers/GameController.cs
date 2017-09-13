using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR.Infrastructure;
using Quizdom.Controllers;
using Quizdom.Data;
using Quizdom.Hubs;
using Quizdom.Models;
using Quizdom.Services;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Quizdom.Controllers
{
    [Route("api/game/")]
    public class GameController : HubController<Broadcaster>
    {
        private ApplicationDbContext _context;
        private UserTracker userTracker;
        private GameService _gameService;

        public GameController(ApplicationDbContext context, GameService gameService, IConnectionManager connectionManager) : base(connectionManager)
        {
            _context = context;
            _gameService = gameService;
            userTracker = new UserTracker(context);
        }


        // GET: /api/game
        [HttpGet]
        public IEnumerable<Game> Get()
        {
            // UPDATE USER TRACKING INFORMATION
            userTracker.UpdateUserActivity(Request);

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

        // SIGNAL R
        [HttpGet]
        [Route("gamechat/{gameid}")]
        public async Task<IActionResult> GetGameChat(int gameid)
        {
            var messages = await _gameService.GetGameMessages(gameid);

            //if (messages == null)
            //{
            //    return StatusCode(500, "Received a null respose from Game Service");
            //}

            return Ok(messages.Select(x => new GameViewModel(x)));
        }

        [HttpPost]
        [Route("gamechat")]
        public async Task<IActionResult> PostGameChat([FromBody]NewGameViewModel message)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Create a new message to save to the database
            var newGameMessage = new GameMessage()
            {
                Content = message.Content,
                //UserId = user.Id,
                //User = user
                GameId = message.GameId,
                UserName = message.UserName

            };

            var record = await _gameService.SaveMessage(newGameMessage);

            // Call the client method 'addGameMessage' on all clients in the submitted group.
            this.Clients.Group(message.Group).AddGameMessage(new GameViewModel(record));

            return new NoContentResult();
        }


        // GET /api/game/1   - get's a specific game
        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
            // UPDATE USER TRACKING INFORMATION
            userTracker.UpdateUserActivity(Request);

            var record = (from c in _context.Games
                          where c.Id == id
                          select c).FirstOrDefault();

            if (record == null)
            {
                return NoContent();
            }

            return Ok(record);
        }

        // GET /api/game/rickco   - get's a specific game by initiatoruserid
        [HttpGet("gameinitiator/{initiatoruserid}")]
        public IActionResult GetGamebyInitiator(string initiatoruserid)
        {
            // UPDATE USER TRACKING INFORMATION
            userTracker.UpdateUserActivity(Request);

            var record = (from c in _context.Games
                          where c.initiatorUserId == initiatoruserid
                          select c).FirstOrDefault();

            if (record == null)
            {
                return NoContent();
            }

            return Ok(record);
        }


        // POST /api/game
        [HttpPost]
        public IActionResult Post([FromBody]Game game)
        {
            // UPDATE USER TRACKING INFORMATION
            userTracker.UpdateUserActivity(Request);

            _context.Games.Add(game);
            _context.SaveChanges();

            return Created("api/game/" + game.Id, game.Id);
        }

        // PUT /api/game/1   ** updates game record by game id
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody]Game games)
        {
            // UPDATE USER TRACKING INFORMATION
            userTracker.UpdateUserActivity(Request);

            var record2 = _context.Games.Where(c => c.Id == id).Count();


            if (record2 == 0)
            {
                return NoContent();
            }

            games.Id = id;
            _context.Games.Update(games);
            await _context.SaveChangesAsync();

            // Call the client method 'ChangeGameData' on all clients in the submitted group.
            var groupName = "game" + games.Id;
            this.Clients.Group(groupName).ChangeGameData(games);

            return Ok(games);
        }

        // DELETE /api/game/1
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            // UPDATE USER TRACKING INFORMATION
            userTracker.UpdateUserActivity(Request);

            _context.Remove(_context.Games.SingleOrDefault<Game>(c => c.Id == id));
            _context.SaveChanges();
            return NoContent();
        }


        // POST /api/game/email  ** Add new gameplayers email record
        [HttpPost("email")]
        public IActionResult Post([FromBody]GamePlayersEmail gamePlayersEmail)
        {
            // UPDATE USER TRACKING INFORMATION
            userTracker.UpdateUserActivity(Request);

            _context.GamePlayersEmail.Add(gamePlayersEmail);
            _context.SaveChanges();

            return Created("api/game/email/" + gamePlayersEmail.Id, gamePlayersEmail.Id);
        }

        // GET: /api/game/email  * get's all game players Email
        [HttpGet("email")]
        public IEnumerable<GamePlayersEmail> GamePlayersEmail()
        {
            // UPDATE USER TRACKING INFORMATION
            userTracker.UpdateUserActivity(Request);

            return _context.GamePlayersEmail.ToList();
        }

        // GET: /api/game/email  * get's all game players Email by GameId
        [HttpGet("email/{gameid}")]
        public IActionResult GameEmailByGameid(int gameid)
        {
            // UPDATE USER TRACKING INFORMATION
            userTracker.UpdateUserActivity(Request);


            var record = (from c in _context.GamePlayersEmail
                          where c.gameId == gameid
                          select c).ToList();

            if (record.Count == 0)
            {
                return NoContent();
            }
            return Ok(record);
        }


        // PUT /api/game/email   ** updates gamePlayersEmail record by id
        [HttpPut("email/{id}")]
        public IActionResult PutEmail(int id, [FromBody]GamePlayersEmail email)
        {
            // UPDATE USER TRACKING INFORMATION
            userTracker.UpdateUserActivity(Request);

            var record2 = _context.GamePlayersEmail.Where(c => c.Id == id).Count();


            if (record2 == 0)
            {
                return NoContent();
            }

            email.Id = id;
            _context.GamePlayersEmail.Update(email);
            _context.SaveChanges();
            return Ok(email);
        }

        // DELETE /api/game/email/1  ** Delete GamePlayersEmail record by id
        [HttpDelete("email/{id}")]
        public IActionResult DeleteEmail(int id)
        {
            // UPDATE USER TRACKING INFORMATION
            userTracker.UpdateUserActivity(Request);

            _context.Remove(_context.GamePlayersEmail.SingleOrDefault<GamePlayersEmail>(c => c.Id == id));
            _context.SaveChanges();
            return NoContent();
        }

                                                                                    //PLAYERSTATS

        // POST /api/game/playerstats  ** Add new playerstats record
        [HttpPost("playerstats")]
        public IActionResult Post([FromBody]PlayerStat playerstats)
        {
            // UPDATE USER TRACKING INFORMATION
            userTracker.UpdateUserActivity(Request);
            
            _context.PlayerStats.Add(playerstats);
            _context.SaveChanges();

            return Created("api/game/playerstats/" + playerstats.Id, playerstats.Id);
        }


        // GET: /api/game/playerstats  * get's playerstats
        [HttpGet("playerstats")]
        public IEnumerable<PlayerStat> PlayerStats()
        {
            // UPDATE USER TRACKING INFORMATION
            userTracker.UpdateUserActivity(Request);

            return _context.PlayerStats.ToList();
        }

        // GET /api/game/playerstats/1   - get's all playerstats by username
        [HttpGet("playerstats/{username}")]
        public IActionResult GetPlayerstatsByUsername(string username)
        {
            // UPDATE USER TRACKING INFORMATION
            userTracker.UpdateUserActivity(Request);

            var record = (from c in _context.PlayerStats
                          where c.userName == username
                          select c).SingleOrDefault();

            return Ok(record);
        }


        // PUT /api/game/playerstats/1   ** updates playerstats record by id
        [HttpPut("playerstats/{id}")]
        public IActionResult Put(int id, [FromBody]PlayerStat playerstat)
        {
            // UPDATE USER TRACKING INFORMATION
            userTracker.UpdateUserActivity(Request);

            var record2 = _context.PlayerStats.Where(c => c.Id == id).Count();


            if (record2 == 0)
            {
                return NoContent();
            }

            playerstat.Id = id;
            _context.PlayerStats.Update(playerstat);
            _context.SaveChanges();


            return Ok(playerstat);
        }

        // DELETE /api/game/playerstats/1  ** Delete PlayerStats record by id
        [HttpDelete("playerstats/{id}")]
        public IActionResult DeletePlayerstats(int id)
        {
            // UPDATE USER TRACKING INFORMATION
            userTracker.UpdateUserActivity(Request);
            
            _context.Remove(_context.PlayerStats.SingleOrDefault<PlayerStat>(c => c.Id == id));
            _context.SaveChanges();
            return NoContent();
        }


        // GET: /api/game/players  * get's all game players
        [HttpGet("players")]
        public IEnumerable<GamePlayers> Gameplayers()
        {
            // UPDATE USER TRACKING INFORMATION
            userTracker.UpdateUserActivity(Request);

            return _context.GamePlayers.ToList();
        }

        // GET /api/game/players/1   - get's all records for a specific game Id
        [HttpGet("players/{gameId}")]
        public IActionResult GetPlayersByGameId(int gameId)
        {
            // UPDATE USER TRACKING INFORMATION
            userTracker.UpdateUserActivity(Request);

            var record = (from c in _context.GamePlayers
                          where c.gameId == gameId
                          select c).ToList();

            //if (record.Count == 0)
            //{
            //    return NoContent();
            //}

            return Ok(record);
        }

        // GET /api/game/players/1/count   - get's a count of players for a specified game
        [HttpGet("players/{gameId}/count")]
        public IActionResult GetPlayersByGameIdCount(int gameId)
        {
            // UPDATE USER TRACKING INFORMATION
            userTracker.UpdateUserActivity(Request);

            var record = (from c in _context.GamePlayers
                          where c.gameId == gameId
                          select c).Count();

            if (record == 0)
            {
                return NoContent();
            }

            return Ok(record);
        }

        // POST /api/game/players  ** Add new gameplayers record
        [HttpPost("players")]
        public IActionResult Post([FromBody]GamePlayers gamePlayers)
        {
            // UPDATE USER TRACKING INFORMATION
            userTracker.UpdateUserActivity(Request);

            // UPDATE GAME ID
            userTracker.UpdateGameId(Request, gamePlayers.userId, gamePlayers.gameId);

            _context.GamePlayers.Add(gamePlayers);
            _context.SaveChanges();

            return Created("api/game/players/" + gamePlayers.Id, gamePlayers.Id);
        }

        // PUT /api/game/players1   ** updates gamePlayers record by id
        [HttpPut("players/{id}")]
        public async Task<IActionResult> Put(int id, [FromBody]GamePlayers player)
        {
            // UPDATE USER TRACKING INFORMATION
            userTracker.UpdateUserActivity(Request);

            var record2 =  _context.GamePlayers.Where(c => c.Id == id).Count();


            if (record2 == 0)
            {
                return NoContent();
            }

            player.Id = id;
            _context.GamePlayers.Update(player);
            await _context.SaveChangesAsync();

            // Call the client method 'ChangeGamePlayerData' on all clients in the submitted group.
            var groupName = "game" + player.gameId;
            this.Clients.Group(groupName).ChangeGamePlayerData(player);

            return Ok(player);
        }

        // DELETE /api/game/players/1  ** Delete GamePlayers record by id
        [HttpDelete("players/{id}")]
        public IActionResult DeletePlayers(int id)
        {
            // UPDATE USER TRACKING INFORMATION
            userTracker.UpdateUserActivity(Request);

            // UPDATE GAME ID - delete game id (set to 0)
            userTracker.UpdateGameId(Request,"", 0);
            

            _context.Remove(_context.GamePlayers.SingleOrDefault<GamePlayers>(c => c.Id == id));
            _context.SaveChanges();
            return NoContent();
        }


        // GET: /api/game/board  * get's all game board
        [HttpGet("board")]
        public IEnumerable<GameBoard> GetBoard()
        {
            // UPDATE USER TRACKING INFORMATION
            userTracker.UpdateUserActivity(Request);

            return _context.GameBoards.ToList();
        }

        // GET /api/game/board/1   - get's all records for a specific game Id
        [HttpGet("board/{gameId}")]
        public IActionResult GetBoardByGameId(int gameId)
        {
            // UPDATE USER TRACKING INFORMATION
            userTracker.UpdateUserActivity(Request);

            var record = (from c in _context.GameBoards
                          where c.gameId == gameId
                          select c).ToList();

            if (record == null)
            {
                return NoContent();
            }

            return Ok(record);
        }

        // GET /api/game/players/1/count   - get's a number of players for a specified game
        [HttpGet("board/{gameId}/count")]
        public IActionResult GetQuestionsByGameIdCount(int gameId)
        {
            // UPDATE USER TRACKING INFORMATION
            userTracker.UpdateUserActivity(Request);

            var record = (from c in _context.GameBoards
                          where c.gameId == gameId
                          select c).Count();

            if (record == 0)
            {
                return NoContent();
            }

            return Ok(record);
        }

        // POST /api/game/board  ** Add new gameboard record
        [HttpPost("board")]
        public IActionResult Post([FromBody]GameBoard gameBoard)
        {
            // UPDATE USER TRACKING INFORMATION
            userTracker.UpdateUserActivity(Request);

            _context.GameBoards.Add(gameBoard);
            _context.SaveChanges();

            return Created("api/game/board/" + gameBoard.Id, gameBoard.Id);
        }

        // PUT /api/game/board/1   ** updates gameBpard record by id
        [HttpPut("board/{id}")]
        public async Task<IActionResult> PutBoard(int id, [FromBody]GameBoard gameBoard)
        {
            // UPDATE USER TRACKING INFORMATION
            userTracker.UpdateUserActivity(Request);

            var record2 = _context.GameBoards.Where(c => c.Id == id).Count();

            if (record2 == 0)
            {
                return NoContent();
            }

            gameBoard.Id = id;
            _context.GameBoards.Update(gameBoard);
            await _context.SaveChangesAsync();

            // Call the client method 'ChangeGameBoardData' on all clients in the submitted group.
            var groupName = "game" + gameBoard.gameId;
            this.Clients.Group(groupName).ChangeGameBoardData(gameBoard);


            return Ok(gameBoard);
        }

        // DELETE /api/game/board/1  ** Delete GameBoard record by id
        [HttpDelete("board/{id}")]
        public IActionResult DeleteBoard(int id)
        {
            // UPDATE USER TRACKING INFORMATION
            userTracker.UpdateUserActivity(Request);

            _context.Remove(_context.GameBoards.SingleOrDefault<GameBoard>(c => c.Id == id));
            _context.SaveChanges();
            return NoContent();
        }

        // GET: /api/game/gameCategories * get's all gamecategories
        [HttpGet("gamecategories")]
        public IActionResult GameCategories()
        {
            // UPDATE USER TRACKING INFORMATION
            userTracker.UpdateUserActivity(Request);

            var record = _context.GameCategories.ToList();

            //if(record.Count == 0)
            //{
            //    return NoContent();
            //}

            return Ok(record);
        }


        // GET /api/game/gamecategories/1   - get's all gamecategories for a specific game Id
        [HttpGet("gamecategories/{gameId}")]
        public IActionResult GetGameCategoriesByGameId(int gameId)
        {
            // UPDATE USER TRACKING INFORMATION
            userTracker.UpdateUserActivity(Request);

            var record = (from c in _context.GameCategories
                          where c.gameId == gameId
                          select c).ToList();

            //if (record.Count == 0)
            //{
            //    return NoContent();
            //}

            return Ok(record);
        }



        // POST /api/game/gamecategories  ** Add new GameCategories record
        [HttpPost("gamecategories")]
        public IActionResult PostGameCategories([FromBody]GameCategories GameCategories)
        {
            // UPDATE USER TRACKING INFORMATION
            userTracker.UpdateUserActivity(Request);

            _context.GameCategories.Add(GameCategories);
            _context.SaveChanges();

            return Created("api/game/gamecategories/" + GameCategories.Id, GameCategories.Id);
        }

        // PUT /api/game/gamecategories/1   ** updates gameBpard record by id
        [HttpPut("gamecategories/{id}")]
        public IActionResult PutGameCategories(int id, [FromBody]GameCategories GameCategories)
        {
            // UPDATE USER TRACKING INFORMATION
            userTracker.UpdateUserActivity(Request);

            var record2 = _context.GameCategories.Where(c => c.Id == id).Count();


            if (record2 == 0)
            {
                return NoContent();
            }

            GameCategories.Id = id;
            _context.GameCategories.Update(GameCategories);
            _context.SaveChanges();
            return Ok(GameCategories);
        }

        // DELETE /api/game/gamecategories/1  ** Delete GameCategories record by id
        [HttpDelete("gamecategories/{id}")]
        public IActionResult DeleteGameCategories(int id)
        {
            // UPDATE USER TRACKING INFORMATION
            userTracker.UpdateUserActivity(Request);

            _context.Remove(_context.GameCategories.SingleOrDefault<GameCategories>(c => c.Id == id));
            _context.SaveChanges();
            return NoContent();
        }
                                                                /* AVATAR API'S */

        // GET: /api/game/avatar * get's all avatars
        [HttpGet("avatar")]
        public IEnumerable<Avatar> Avatar()
        {
            // UPDATE USER TRACKING INFORMATION
            userTracker.UpdateUserActivity(Request);

            return _context.Avatars.ToList();
        }

        // POST /api/game/avatar  ** Add new GameCategories record
        [HttpPost("avatar")]
        public IActionResult PostAvatar([FromBody]Avatar Avatar)
        {
            // UPDATE USER TRACKING INFORMATION
            userTracker.UpdateUserActivity(Request);

            _context.Avatars.Add(Avatar);
            _context.SaveChanges();

            return Created("api/game/avatar/" + Avatar.Id, Avatar.Id);
        }

        // PUT /api/game/avatar/1   ** updates avatar record by id
        [HttpPut("avatar/{id}")]
        public IActionResult PutAvatar(int id, [FromBody]Avatar Avatar)
        {
            // UPDATE USER TRACKING INFORMATION
            userTracker.UpdateUserActivity(Request);

            var record2 = _context.Avatars.Where(c => c.Id == id).Count();


            if (record2 == 0)
            {
                return NoContent();
            }

            Avatar.Id = id;
            _context.Avatars.Update(Avatar);
            _context.SaveChanges();
            return Ok(Avatar);
        }

        // DELETE /api/game/avatar/1  ** Delete avatar record by id
        [HttpDelete("avatar/{id}")]
        public IActionResult DeleteAvatar(int id)
        {
            // UPDATE USER TRACKING INFORMATION
            userTracker.UpdateUserActivity(Request);

            _context.Remove(_context.Avatars.SingleOrDefault<Avatar>(c => c.Id == id));
            _context.SaveChanges();
            return NoContent();
        }

        // GET /api/game/avatar/1   - get's Avatar information for a specific Id
        [HttpGet("avatar/{id}")]
        public IActionResult GetAvatarById(int id)
        {
            // UPDATE USER TRACKING INFORMATION
            userTracker.UpdateUserActivity(Request);

            var record = (from c in _context.Avatars
                          where c.Id == id
                          select c).FirstOrDefault();

            if (record == null)
            {
                return NoContent();
            }

            return Ok(record);
        }


        // GET: /api/game/categories * get's all categories
        [HttpGet("categories")]
        public IEnumerable<Category> Category()
        {
            // UPDATE USER TRACKING INFORMATION
            userTracker.UpdateUserActivity(Request);

            return _context.Categories.ToList();
        }


        // GET /api/game/categories/1   - get's categories for a specific Id
        [HttpGet("categories/{id}")]
        public IActionResult GetCategoriesById(int id)
        {
            // UPDATE USER TRACKING INFORMATION
            userTracker.UpdateUserActivity(Request);

            var record = (from c in _context.Categories
                          where c.Id == id
                          select c).FirstOrDefault();

            if (record == null)
            {
                return NoContent();
            }

            return Ok(record);
        }


        // POST /api/game/categories  ** Add new category record
        [HttpPost("categories")]
        public IActionResult PostCategory([FromBody]Category Category)
        {
            // UPDATE USER TRACKING INFORMATION
            userTracker.UpdateUserActivity(Request);

            _context.Categories.Add(Category);
            _context.SaveChanges();

            return Created("api/game/categories/" + Category.Id, Category.Id);
        }

        // PUT /api/game/categories/1   ** updates category record by id
        [HttpPut("categories/{id}")]
        public IActionResult PutCategory(int id, [FromBody]Category Category)
        {
            // UPDATE USER TRACKING INFORMATION
            userTracker.UpdateUserActivity(Request);

            var record2 = _context.Categories.Where(c => c.Id == id).Count();


            if (record2 == 0)
            {
                return NoContent();
            }

            Category.Id = id;
            _context.Categories.Update(Category);
            _context.SaveChanges();
            return Ok(Category);
        }

        // DELETE /api/game/categories/1  ** Delete game record by id
        [HttpDelete("categories/{id}")]
        public IActionResult DeleteCategory(int id)
        {
            // UPDATE USER TRACKING INFORMATION
            userTracker.UpdateUserActivity(Request);

            _context.Remove(_context.Categories.SingleOrDefault<Category>(c => c.Id == id));
            _context.SaveChanges();
            return NoContent();
        }
                                                        /* FRIENDS API'S */

        // GET: /api/game/friends * get's all friends
        [HttpGet("friends")]
        public IEnumerable<Friend> GetFriends()
        {
            // UPDATE USER TRACKING INFORMATION
            userTracker.UpdateUserActivity(Request);

            return _context.Friends.ToList();
        }

        // POST /api/game/friends  ** Add new friends record
        [HttpPost("friends")]
        public IActionResult PostFriend([FromBody]Friend Friend)
        {
            // UPDATE USER TRACKING INFORMATION
            userTracker.UpdateUserActivity(Request);

            _context.Friends.Add(Friend);
            _context.SaveChanges();

            return Created("api/game/friends/" + Friend.Id, Friend.Id);
        }

        // PUT /api/game/friend/1   ** updates friend record by id
        [HttpPut("friends/{id}")]
        public IActionResult PutFriend(int id, [FromBody]Friend Friend)
        {
            // UPDATE USER TRACKING INFORMATION
            userTracker.UpdateUserActivity(Request);

            var record2 = _context.Friends.Where(c => c.Id == id).Count();


            if (record2 == 0)
            {
                return NoContent();
            }

            Friend.Id = id;
            _context.Friends.Update(Friend);
            _context.SaveChanges();
            return Ok(Friend);
        }

        // DELETE /api/game/friends/1  ** Delete friend record by id
        [HttpDelete("friends/{id}")]
        public IActionResult DeleteFriend(int id)
        {
            _context.Remove(_context.Friends.SingleOrDefault<Friend>(c => c.Id == id));
            _context.SaveChanges();
            return NoContent();
        }

        // GET /api/game/friends/1   - get's Friend information for a specific Id
        [HttpGet("friends/{id}")]
        public IActionResult GetFriendById(int id)
        {
            // UPDATE USER TRACKING INFORMATION
            userTracker.UpdateUserActivity(Request);

            var record = (from c in _context.Friends
                          where c.Id == id
                          select c).FirstOrDefault();

            if (record == null)
            {
                return NoContent();
            }

            return Ok(record);
        }

        // GET /api/game/friends/rickco   - get's all Friends associated with a primary username
        [HttpGet("friends/primaryusername/{username}")]
        public IActionResult GetFriendsByUserName(string username)
        {
            // UPDATE USER TRACKING INFORMATION
            userTracker.UpdateUserActivity(Request);

            var record = (from c in _context.Friends
                          where c.primaryUserName == username
                          select c).ToList();

            if (record == null)
            {
                return NoContent();
            }

            return Ok(record);
        }

        // GET /api/game/friends/rickco   - get's id from primaryusername and friendusername combo
        [HttpGet("friends/primaryusername/{primaryusername}/friendusername/{friendusername}")]
        public IActionResult GetFriendsByFriendUserName(string primaryusername, string friendusername)
        {
            // UPDATE USER TRACKING INFORMATION
            userTracker.UpdateUserActivity(Request);

            var record = (from c in _context.Friends
                          where c.primaryUserName == primaryusername
                          && c.friendUserName == friendusername
                          select c).ToList();

            if (record == null)
            {
                return NoContent();
            }

            return Ok(record);
        }


        // PUT /api/game/updateuseractivitygameid/username/gameid   ** updates useractivity table by username
        [HttpPut("updateuseractivitygameid/{username}/{gameid}")]
        public IActionResult UpdateGameIdUserActivity(string username, int gameid)
        {
            // UPDATE USER TRACKING INFORMATION
            userTracker.UpdateUserActivity(Request);

            var userActivityRecord = _context.UserActivity.Where(c => c.Username == username).FirstOrDefault();


            if (userActivityRecord == null)
            {
                return NoContent();
            }
            
            userActivityRecord.GameId = gameid;
            _context.UserActivity.Update(userActivityRecord);
            _context.SaveChanges();

            return Ok(userActivityRecord);
        }



    }
}
