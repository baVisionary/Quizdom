namespace Quizdom.Views.User {
    export class UserController {
        public friendEdit: boolean = false;
        public searchTerm: string = "";
        public feedback: string = "";
        public friendError: string = "";
        public friendSuccess: string = "";
        private tempFriend: any = new Models.UserModel;

        static $inject = [
            'FriendService',
            'AuthenticationService',
            '$state'
        ];

        constructor(
            private FriendService: Services.FriendService,
            private AuthenticationService: Services.AuthenticationService,
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
                    this.friendError = error.data;
                });

        }

        public editFriends(): void {
            this.friendEdit = !this.friendEdit;
            console.log(`friendEdit: ${this.friendEdit}`);

        }

        public findFriend(search: string): any {
            let found: Models.UserModel = new Models.UserModel;
            this.feedback = "";
            if (this.FriendService.isMe(search)) {
                this.searchTerm = "";
                this.feedback = `${search} is your info, ya bonehead!`
                return;
            } else if (this.FriendService.isNewFriend(search)) {
                this.FriendService.findByUserName(search)
                    .then((found) => {
                        // Need to confirm that 204 not returned or 200 returned
                        console.log(found.hasOwnProperty('userName'));
                        if (found.hasOwnProperty('userName')) {
                            this.updateFriends(found);
                            return found;
                        } else {
                            this.FriendService.findByEmail(search)
                                .then((found) => {
                                    console.log(found.hasOwnProperty('userName'));
                                    if (found.hasOwnProperty('userName')) {
                                        this.updateFriends(found);
                                        return found;
                                    }
                                    this.feedback = `${search} not found as Username or Email`;
                                    return;
                                })

                        }
                    })
                    .catch((error) => {
                        console.log(error);
                        this.feedback = `${error.status}: ${error.statusText}`;
                        return;
                    });
            } else {
                this.searchTerm = "";
                this.feedback = `${search} is already a friend`
                return;
            }
        }

        public updateFriends(newFriend) {
            this.searchTerm = "";
            this.FriendService.addFriend(this.AuthenticationService.User.userName, newFriend)
                .then((response) => {
                    console.log(response);
                    newFriend.friendId = response.id;
                    console.log(newFriend);
                    this.FriendService.friends.push(newFriend);
                    console.log(this.FriendService.friends);

                })
                .catch(() => {

                });
        }

        public deleteFriend(friendId) {
            if (this.editFriends) {
                this.FriendService.removeFriend(this.AuthenticationService.User.userName, friendId).$promise
                    .then(() => {
                        let oldFriendIndex = this.FriendService.friends.findIndex(f => { return f.friendId == friendId });
                        if (oldFriendIndex >= 0) {
                            console.log(oldFriendIndex);
                            this.FriendService.friends.splice(oldFriendIndex, 1);
                            console.log(`Deleted friendId: ${friendId}`);
                        }
                    })
                    .catch(() => {

                    });
            }
        }

    }
}