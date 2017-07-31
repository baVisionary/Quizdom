﻿using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.SignalR.Hubs;
using Microsoft.AspNetCore.SignalR.Infrastructure;

namespace Quizdom.Controllers
{
    public abstract class HubController<T> : Controller
        where T : Hub
    {
        private readonly IHubContext _hub;
        public IHubConnectionContext<dynamic> Clients { get; private set; }
        public IGroupManager Groups { get; private set; }

        protected HubController(IConnectionManager signalRConnectionManager)
        {
            _hub = signalRConnectionManager.GetHubContext<T>();
            Clients = _hub.Clients;
            Groups = _hub.Groups;
        }
    }
}