namespace Quizdom.Views.User {
    export class UserController {
        public friendEdit: boolean = false;
        public searchTerm: string = "";
        public feedback: string = "";

        static $inject = [
            // 'LoginService',
            // 'AvatarService',
            'FriendService',
            'AuthenticationService',
            '$scope',
            '$state'
        ];

        constructor(
            // private LoginService: Services.LoginService,
            // private AvatarService: Services.AvatarService,
            private FriendService: Services.FriendService,
            private AuthenticationService: Services.AuthenticationService,
            private $scope: ng.IScope,
            private $state: ng.ui.IStateService
        ) {
            if (!this.AuthenticationService.isLoggedIn) {
                this.$state.go('Login');
            }
            this.FriendService.getMyFriends(this.AuthenticationService.User.userName).$promise
                .then(() => {
                    console.log(this.FriendService.friends);
                })
                .catch((error) => {
                    this.feedback = error.data;
                });

        }

        public editFriends(): void {
            this.friendEdit = !this.friendEdit;
            console.log(`friendEdit: ${this.friendEdit}`);

        }

        public findFriend(search: string): any {
            let found: Models.UserModel = new Models.UserModel;
            this.feedback = "";
            this.FriendService.findByUserName(search)
                .then((found) => {
                    console.log(found);
                    if (found) {
                        this.updateFriends(found);
                    } else {
                        this.feedback = `${search} not found as Username `
                    }
                })
                .catch((error) => {
                    console.log(error.data);
                    this.feedback = error.data;
                });
            this.FriendService.findByEmail(search)
                .then((found) => {
                    console.log(found);
                    if (found) {
                        this.updateFriends(found);
                    } else {
                        this.feedback += `${search} not found as Email`
                    }
                })
                .catch((error) => {
                    console.log(error.data);
                    this.feedback += error.data;
                });
        }

        public updateFriends(newFriend) {
            this.searchTerm = "";
            this.FriendService.addFriend(this.AuthenticationService.User.userName, newFriend).$promise
                .then(() => {
                    this.FriendService.getMyFriends(this.AuthenticationService.User.userName);
                })
        }

        public deleteFriend(friendId) {
            if (this.editFriends) {
                this.FriendService.removeFriend(this.AuthenticationService.User.userName, friendId).$promise
                    .then(() => {
                        this.FriendService.getMyFriends(this.AuthenticationService.User.userName);
                    })
            }
        }

    }
}