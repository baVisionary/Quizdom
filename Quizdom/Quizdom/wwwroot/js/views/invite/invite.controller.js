var Quizdom;
(function (Quizdom) {
    var Views;
    (function (Views) {
        var Invite;
        (function (Invite) {
            var InviteController = (function () {
                function InviteController(AuthenticationService, PlayerService, FriendService, ActiveService, GameService, $state) {
                    var _this = this;
                    this.AuthenticationService = AuthenticationService;
                    this.PlayerService = PlayerService;
                    this.FriendService = FriendService;
                    this.ActiveService = ActiveService;
                    this.GameService = GameService;
                    this.$state = $state;
                    this.player = "";
                    this.feedback = "";
                    if (!this.AuthenticationService.isLoggedIn) {
                        this.$state.go('Login');
                    }
                    this.loadMyFriends();
                    this.loadActiveUsers();
                    this.GameService.gameData = new Quizdom.Models.GameModel;
                    this.GameService.loadMyGameData(this.AuthenticationService.User.userName)
                        .then(function () {
                        console.log("Loading Game " + _this.GameService.gameId + " Players from DB...");
                        _this.GameService.loadPlayers(_this.GameService.gameId, _this.AuthenticationService.User.userName)
                            .then(function () {
                            if (_this.GameService.players.length == 0) {
                                _this.GameService.addPlayer(_this.GameService.gameId, _this.AuthenticationService.User, true);
                            }
                        });
                    });
                }
                InviteController.prototype.loadActiveUsers = function () {
                    var _this = this;
                    this.ActiveService.getActiveUsers()
                        .then(function () {
                        console.log("Active:", _this.ActiveService.ActiveUsers);
                    })
                        .catch(function (error) {
                        console.log(error);
                    });
                };
                InviteController.prototype.loadMyFriends = function () {
                    var _this = this;
                    this.FriendService.getMyFriends(this.AuthenticationService.User.userName).$promise
                        .then(function () {
                        console.log("Friends:", _this.FriendService.friends);
                    })
                        .catch(function (error) {
                        console.log(error);
                    });
                };
                InviteController.prototype.findPlayer = function (search) {
                    var _this = this;
                    var found = new Quizdom.Models.UserModel;
                    this.feedback = "";
                    if (this.FriendService.isMe(search)) {
                        this.player = "";
                        this.feedback = search + " is you, ya bonehead!";
                        return;
                    }
                    this.PlayerService.findByUserName(search)
                        .then(function (found) {
                        // Need to confirm that 204 not returned or 200 returned
                        // console.log(found.hasOwnProperty('userName'));
                        if (found.hasOwnProperty('userName')) {
                            _this.player = "";
                            _this.GameService.addPlayer(_this.GameService.gameId, found, false);
                            return found;
                        }
                        else {
                            _this.PlayerService.findByEmail(search)
                                .then(function (found) {
                                console.log(found.hasOwnProperty('userName'));
                                if (found.hasOwnProperty('userName')) {
                                    _this.player = "";
                                    _this.GameService.addPlayer(_this.GameService.gameId, found, false);
                                    return found;
                                }
                                // Check if search is formatted as email
                                // YES - offer to send email invite
                                // NO - feedback "User not found - Enter email to send Quizdom invitation" 
                                _this.feedback = search + " not found as Username or Email";
                                return;
                            });
                        }
                    })
                        .catch(function (error) {
                        console.log(error);
                        _this.feedback = error.status + ": " + error.statusText;
                        return;
                    });
                };
                InviteController.prototype.addPlayer = function (user) {
                    console.log("Add player requested:", user.userName);
                    this.GameService.addPlayer(this.GameService.gameId, user, false);
                };
                InviteController.prototype.removePlayer = function (playerId) {
                    this.GameService.removePlayer(playerId);
                };
                InviteController.prototype.goToSetup = function () {
                    this.$state.go("Setup");
                };
                InviteController.$inject = [
                    'AuthenticationService',
                    'PlayerService',
                    'FriendService',
                    'ActiveService',
                    'GameService',
                    '$state'
                ];
                return InviteController;
            }());
            Invite.InviteController = InviteController;
        })(Invite = Views.Invite || (Views.Invite = {}));
    })(Views = Quizdom.Views || (Quizdom.Views = {}));
})(Quizdom || (Quizdom = {}));
