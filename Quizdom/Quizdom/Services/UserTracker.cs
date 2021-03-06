﻿using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Quizdom.Data;
using Quizdom.Models;
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
        private ApplicationDbContext _context;

        public UserTracker(ApplicationDbContext context)
        {
            _context = context;
        }

        public static string ExtractUsernameHeader(HttpRequest request)
        {
            string username =  request.Headers["Username"];
            return username;
        }

        private static string ExtractRoleHeader(HttpRequest request)
        {
            string role = request.Headers["Role"];
            return role;
        }

        //update USERACTIVITY table
        public void UpdateUserActivity(HttpRequest request)
        {
            UserActivity userActivity = new UserActivity();

            string username = ExtractUsernameHeader(request);
            if (username == null)
                username = "guest";

            var validatedUserNameRecord = (from c in _context.UserActivity
                                    where c.Username == username
                                    select c).FirstOrDefault();


            if (validatedUserNameRecord == null)
            {
                userActivity.LastActivity = DateTime.UtcNow;
                userActivity.Username = username;
                _context.UserActivity.Add(userActivity);
                _context.SaveChanges();
            }
            else
            {
                validatedUserNameRecord.LastActivity = DateTime.UtcNow;                

                _context.UserActivity.Update(validatedUserNameRecord);
                _context.SaveChanges();
            }
            


        }

        public void UpdateGameId(HttpRequest request, string username,int gameid)
        {
            UserActivity userActivity = new UserActivity();

            string userName = ExtractUsernameHeader(request);
            if (username == "")
            {
                username = userName;
            }

            var validatedUserNameRecord = (from c in _context.UserActivity
                                           where c.Username == username
                                           select c).FirstOrDefault();



                validatedUserNameRecord.GameId = gameid;
                //validatedUserNameRecord.Username = userName;

                _context.UserActivity.Update(validatedUserNameRecord);
                _context.SaveChanges();
        }

        public bool ValidateUserAccess(HttpRequest request, string questionUsername)
        {
            string username = ExtractUsernameHeader(request);
            string role = ExtractRoleHeader(request);

            //var validateQuestionUsername = ().FirstOrDefault();
            if (questionUsername != username && role != "Admin")
            {
                return false;
            }

            return true;

        }
    }
}
