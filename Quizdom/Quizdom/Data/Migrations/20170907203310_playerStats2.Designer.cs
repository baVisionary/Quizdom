﻿using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Quizdom.Data;

namespace Quizdom.Data.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    [Migration("20170907203310_playerStats2")]
    partial class playerStats2
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
            modelBuilder
                .HasAnnotation("ProductVersion", "1.1.2");

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.EntityFrameworkCore.IdentityRole", b =>
                {
                    b.Property<string>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken();

                    b.Property<string>("Name")
                        .HasMaxLength(256);

                    b.Property<string>("NormalizedName")
                        .HasMaxLength(256);

                    b.HasKey("Id");

                    b.HasIndex("NormalizedName")
                        .IsUnique()
                        .HasName("RoleNameIndex");

                    b.ToTable("AspNetRoles");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.EntityFrameworkCore.IdentityRoleClaim<string>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("ClaimType");

                    b.Property<string>("ClaimValue");

                    b.Property<string>("RoleId")
                        .IsRequired();

                    b.HasKey("Id");

                    b.HasIndex("RoleId");

                    b.ToTable("AspNetRoleClaims");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.EntityFrameworkCore.IdentityUserClaim<string>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("ClaimType");

                    b.Property<string>("ClaimValue");

                    b.Property<string>("UserId")
                        .IsRequired();

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("AspNetUserClaims");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.EntityFrameworkCore.IdentityUserLogin<string>", b =>
                {
                    b.Property<string>("LoginProvider");

                    b.Property<string>("ProviderKey");

                    b.Property<string>("ProviderDisplayName");

                    b.Property<string>("UserId")
                        .IsRequired();

                    b.HasKey("LoginProvider", "ProviderKey");

                    b.HasIndex("UserId");

                    b.ToTable("AspNetUserLogins");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.EntityFrameworkCore.IdentityUserRole<string>", b =>
                {
                    b.Property<string>("UserId");

                    b.Property<string>("RoleId");

                    b.HasKey("UserId", "RoleId");

                    b.HasIndex("RoleId");

                    b.ToTable("AspNetUserRoles");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.EntityFrameworkCore.IdentityUserToken<string>", b =>
                {
                    b.Property<string>("UserId");

                    b.Property<string>("LoginProvider");

                    b.Property<string>("Name");

                    b.Property<string>("Value");

                    b.HasKey("UserId", "LoginProvider", "Name");

                    b.ToTable("AspNetUserTokens");
                });

            modelBuilder.Entity("Quizdom.Models.ApplicationUser", b =>
                {
                    b.Property<string>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<int>("AccessFailedCount");

                    b.Property<int>("AvatarId");

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken();

                    b.Property<string>("Email")
                        .HasMaxLength(256);

                    b.Property<bool>("EmailConfirmed");

                    b.Property<bool>("LockoutEnabled");

                    b.Property<DateTimeOffset?>("LockoutEnd");

                    b.Property<string>("NormalizedEmail")
                        .HasMaxLength(256);

                    b.Property<string>("NormalizedUserName")
                        .HasMaxLength(256);

                    b.Property<string>("PasswordHash");

                    b.Property<string>("PhoneNumber");

                    b.Property<bool>("PhoneNumberConfirmed");

                    b.Property<string>("SecurityStamp");

                    b.Property<bool>("TwoFactorEnabled");

                    b.Property<string>("UserName")
                        .HasMaxLength(256);

                    b.HasKey("Id");

                    b.HasIndex("NormalizedEmail")
                        .HasName("EmailIndex");

                    b.HasIndex("NormalizedUserName")
                        .IsUnique()
                        .HasName("UserNameIndex");

                    b.ToTable("AspNetUsers");
                });

            modelBuilder.Entity("Quizdom.Models.Avatar", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("ImageUrl");

                    b.HasKey("Id");

                    b.ToTable("Avatars");
                });

            modelBuilder.Entity("Quizdom.Models.Category", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("LongDescription");

                    b.Property<string>("ShortDescription");

                    b.HasKey("Id");

                    b.ToTable("Categories");
                });

            modelBuilder.Entity("Quizdom.Models.Friend", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("friendUserName");

                    b.Property<string>("primaryUserName");

                    b.HasKey("Id");

                    b.ToTable("Friends");
                });

            modelBuilder.Entity("Quizdom.Models.Game", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("activeUserId");

                    b.Property<int>("gameBoardId");

                    b.Property<int>("gameLength");

                    b.Property<string>("gameState");

                    b.Property<string>("initiatorUserId");

                    b.Property<string>("lastActiveUserId");

                    b.Property<DateTime>("startDateTime");

                    b.HasKey("Id");

                    b.ToTable("Games");
                });

            modelBuilder.Entity("Quizdom.Models.GameBoard", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("answerA");

                    b.Property<string>("answerB");

                    b.Property<string>("answerC");

                    b.Property<string>("answerD");

                    b.Property<int>("answerOrder");

                    b.Property<int>("answeredCorrectlyDelay");

                    b.Property<string>("answeredCorrectlyUserId");

                    b.Property<int>("boardColumn");

                    b.Property<int>("boardRow");

                    b.Property<int>("categoryId");

                    b.Property<int>("correctAnswer");

                    b.Property<string>("difficulty");

                    b.Property<int>("gameId");

                    b.Property<int>("prizePoints");

                    b.Property<int>("questionId");

                    b.Property<string>("questionState");

                    b.Property<string>("questionText");

                    b.HasKey("Id");

                    b.HasIndex("gameId");

                    b.ToTable("GameBoards");
                });

            modelBuilder.Entity("Quizdom.Models.GameCategories", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<int>("categoryId");

                    b.Property<int>("gameId");

                    b.HasKey("Id");

                    b.HasIndex("gameId");

                    b.ToTable("GameCategories");
                });

            modelBuilder.Entity("Quizdom.Models.GameMessage", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Content")
                        .IsRequired();

                    b.Property<DateTime>("DateCreated")
                        .IsConcurrencyToken()
                        .ValueGeneratedOnAddOrUpdate();

                    b.Property<int>("GameId");

                    b.Property<string>("UserName")
                        .IsRequired();

                    b.HasKey("Id");

                    b.HasIndex("GameId");

                    b.ToTable("GameMessage");
                });

            modelBuilder.Entity("Quizdom.Models.GamePlayers", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<int>("answer");

                    b.Property<int>("delay");

                    b.Property<int>("gameId");

                    b.Property<bool>("initiator");

                    b.Property<string>("playerState");

                    b.Property<int>("prizePoints");

                    b.Property<int>("questionsRight");

                    b.Property<int>("questionsRightDelay");

                    b.Property<int>("questionsWon");

                    b.Property<string>("userId");

                    b.HasKey("Id");

                    b.HasIndex("gameId");

                    b.ToTable("GamePlayers");
                });

            modelBuilder.Entity("Quizdom.Models.GamePlayersEmail", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<int>("gameId");

                    b.Property<string>("userEmail");

                    b.HasKey("Id");

                    b.HasIndex("gameId");

                    b.ToTable("GamePlayersEmail");
                });

            modelBuilder.Entity("Quizdom.Models.Message", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Content")
                        .IsRequired();

                    b.Property<DateTime>("DateCreated")
                        .IsConcurrencyToken()
                        .ValueGeneratedOnAddOrUpdate();

                    b.Property<string>("UserName")
                        .IsRequired();

                    b.HasKey("Id");

                    b.ToTable("Message");
                });

            modelBuilder.Entity("Quizdom.Models.PlayerStat", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<int>("gamesPlayed");

                    b.Property<int>("gamesWon");

                    b.Property<int>("questionsRight");

                    b.Property<int>("questionsRightDelay");

                    b.Property<int>("questionsWon");

                    b.Property<string>("userName");

                    b.HasKey("Id");

                    b.ToTable("PlayerStats");
                });

            modelBuilder.Entity("Quizdom.Models.Quiz", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<int?>("AvatarId");

                    b.Property<string>("Category");

                    b.Property<int?>("CategoryId");

                    b.Property<string>("Correct_Answer");

                    b.Property<DateTime>("DateModified");

                    b.Property<string>("Difficulty");

                    b.Property<string>("Incorrect_Answer1");

                    b.Property<string>("Incorrect_Answer2");

                    b.Property<string>("Incorrect_Answer3");

                    b.Property<string>("Incorrect_Answer4");

                    b.Property<string>("Question");

                    b.Property<string>("Source");

                    b.Property<string>("Type");

                    b.Property<string>("UserId");

                    b.Property<int>("answerDelay");

                    b.Property<int>("answeredCorrectly");

                    b.Property<int>("askedInGame");

                    b.HasKey("Id");

                    b.ToTable("Quiz");
                });

            modelBuilder.Entity("Quizdom.Models.UserActivity", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<int>("GameId");

                    b.Property<bool>("IsLoggedin");

                    b.Property<DateTime>("LastActivity");

                    b.Property<string>("Username");

                    b.HasKey("Id");

                    b.ToTable("UserActivity");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.EntityFrameworkCore.IdentityRoleClaim<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.EntityFrameworkCore.IdentityRole")
                        .WithMany("Claims")
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.EntityFrameworkCore.IdentityUserClaim<string>", b =>
                {
                    b.HasOne("Quizdom.Models.ApplicationUser")
                        .WithMany("Claims")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.EntityFrameworkCore.IdentityUserLogin<string>", b =>
                {
                    b.HasOne("Quizdom.Models.ApplicationUser")
                        .WithMany("Logins")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.EntityFrameworkCore.IdentityUserRole<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.EntityFrameworkCore.IdentityRole")
                        .WithMany("Users")
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("Quizdom.Models.ApplicationUser")
                        .WithMany("Roles")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Quizdom.Models.GameBoard", b =>
                {
                    b.HasOne("Quizdom.Models.Game", "Game")
                        .WithMany()
                        .HasForeignKey("gameId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Quizdom.Models.GameCategories", b =>
                {
                    b.HasOne("Quizdom.Models.Game", "Game")
                        .WithMany()
                        .HasForeignKey("gameId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Quizdom.Models.GameMessage", b =>
                {
                    b.HasOne("Quizdom.Models.Game", "Game")
                        .WithMany()
                        .HasForeignKey("GameId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Quizdom.Models.GamePlayers", b =>
                {
                    b.HasOne("Quizdom.Models.Game", "Game")
                        .WithMany()
                        .HasForeignKey("gameId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Quizdom.Models.GamePlayersEmail", b =>
                {
                    b.HasOne("Quizdom.Models.Game", "Game1")
                        .WithMany()
                        .HasForeignKey("gameId")
                        .OnDelete(DeleteBehavior.Cascade);
                });
        }
    }
}
