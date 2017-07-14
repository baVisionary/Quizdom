using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Quizdom.Models
{
    public class GameCategories
    {
        public int Id { get; set; }
        public int gameId { get; set; }
        public int categoryId { get; set; }
    }
}
