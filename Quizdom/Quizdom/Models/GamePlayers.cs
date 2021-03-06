﻿using System.ComponentModel.DataAnnotations.Schema;

namespace Quizdom.Models
{
    public class GamePlayers
    {
        public int Id { get; set; }

        [ForeignKey("Game")]
        public int gameId { get; set; }

        public Game Game { get; set; }

        public string userId { get; set; }
        public bool initiator { get; set; }
        public int prizePoints { get; set; }
        public int answer { get; set; }
        public int delay { get; set; }
        public string playerState { get; set; }
        public int questionsWon { get; set; }
        public int questionsRight { get; set; }
        public int questionsRightDelay { get; set; }
    }
}
