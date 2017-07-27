var Quizdom;
(function (Quizdom) {
    var Services;
    (function (Services) {
        var AvatarService = (function () {
            function AvatarService($resource, $q) {
                this.$resource = $resource;
                this.$q = $q;
                this.avatars = [];
                this.oneAvatarUrl = 'avatar_generic.png';
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
                //     this.oneAvatar = this.Avatar.get({avatarId: avatarId}, function () {
                //       console.log(this.oneAvatar);
                //     }).$promise
                //       .catch((error) => {
                //         console.log(`Unable to retrieve avatar - ${error}`);
                //         return null;
                //       });
                //   } else {
                //     this.oneAvatar = this.avatars.find(avatar => { return avatar.id == avatarId });
                //   }
                //   return this.oneAvatar;
                // }
                this._Resource_avatar = this.$resource('/api/game/avatar/:avatarId');
                // this.getAllAvatars();
            }
            AvatarService.prototype.getAllAvatars = function () {
                if (this.avatars.length == 0) {
                    this.avatars = this._Resource_avatar.query();
                    return this.avatars.$promise;
                }
                var avatars = this.$q.defer();
                avatars.resolve(this.avatars);
                return avatars;
            };
            AvatarService.prototype.getAvatarUrl = function (avatarId) {
                var _this = this;
                if (this.avatars.length > 0) {
                    this.avatars.forEach(function (avatar) {
                        if (avatar.id == avatarId) {
                            _this.oneAvatar = avatar;
                        }
                        ;
                    });
                    return this.oneAvatar.imageUrl;
                }
                else {
                    this.oneAvatar = this._Resource_avatar.get({
                        avatarId: avatarId
                    });
                    return this.oneAvatar.imageUrl;
                }
            };
            return AvatarService;
        }());
        AvatarService.$inject = [
            '$resource',
            '$q'
        ];
        Services.AvatarService = AvatarService;
    })(Services = Quizdom.Services || (Quizdom.Services = {}));
})(Quizdom || (Quizdom = {}));
