var Quizdom;
(function (Quizdom) {
    var Services;
    (function (Services) {
        var AvatarService = (function () {
            function AvatarService($resource
                // private AvatarResource: ,
                // private Avatar: Models.IAvatarResource
            ) {
                this.$resource = $resource;
                this.avatars = [];
                /**
                 * get array of avatars
                 */
                // public loadAvatars() {
                //   if (this.avatars.length == 0) {
                //     this.avatars = this.Avatar.query(function () {
                //       console.log(this.avatars);
                //     }).$promise
                //       .catch((error) => {
                //         console.log(`Unable to get avatars - ${error}`);
                //         return [];
                //       });
                //   }
                //   return this.avatars;
                // }
                // public loadMyAvatar(avatarId: number) {
                //   if (this.avatars.length == 0) {
                //     this.myAvatar = this.Avatar.get({avatarId: avatarId}, function () {
                //       console.log(this.myAvatar);
                //     }).$promise
                //       .catch((error) => {
                //         console.log(`Unable to retrieve avatar - ${error}`);
                //         return null;
                //       });
                //   } else {
                //     this.myAvatar = this.avatars.find(avatar => { return avatar.id == avatarId });
                //   }
                //   return this.myAvatar;
                // }
                this._Resource_avatar = this.$resource('/api/game/avatar/:avatarId');
            }
            AvatarService.prototype.getAllAvatars = function () {
                var _this = this;
                if (this.avatars.length == 0) {
                    this.avatars = this._Resource_avatar.query();
                    this.avatars.$promise.then(function () {
                        console.log(_this.avatars);
                    })
                        .catch(function (error) {
                        console.log("Avatars not retrieved database");
                        return error;
                    });
                }
                return this.avatars;
            };
            AvatarService.prototype.getOneAvatar = function (avatarId) {
                var _this = this;
                if (this.avatars.length > 0) {
                    this.myAvatar = this.avatars.find(function (avatar) { return avatar.id == avatarId; });
                }
                else {
                    this.myAvatar = this._Resource_avatar.get({
                        avatarId: avatarId
                    });
                    this.myAvatar.$promise.then(function () {
                        console.log(_this.myAvatar);
                    })
                        .catch(function (error) {
                        console.log(error.status + ": " + error.data);
                        return error;
                    });
                }
                return this.myAvatar;
            };
            return AvatarService;
        }());
        AvatarService.$inject = [
            '$resource'
        ];
        Services.AvatarService = AvatarService;
    })(Services = Quizdom.Services || (Quizdom.Services = {}));
})(Quizdom || (Quizdom = {}));
