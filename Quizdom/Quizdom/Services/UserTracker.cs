using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Quizdom.Services
{
    /*
     * 1. Put user name in header on Angular app and send it with each request
     * 2. This class will have a method to extract the header
     * 3. This class will have another method to update last activity date
     */ 
    public class UserTracker
    {
        private static string ExtractUsernameHeader(HttpRequest request)
        {
            string username =  request.Headers["Username"];
            return username;
        }

        public static void UpdateUserActivity(HttpRequest request)
        {
            
            string username = ExtractUsernameHeader(request);
            //update table where username is the user sent in

        }
    }
}
