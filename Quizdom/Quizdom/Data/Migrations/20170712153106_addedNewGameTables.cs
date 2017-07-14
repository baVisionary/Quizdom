using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Quizdom.Data.Migrations
{
    public partial class addedNewGameTables : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "LastActiveUserId",
                table: "Games",
                newName: "lastActiveUserId");

            migrationBuilder.RenameColumn(
                name: "GameLength",
                table: "Games",
                newName: "gameLength");

            migrationBuilder.RenameColumn(
                name: "ActiveUserId",
                table: "Games",
                newName: "activeUserId");

            migrationBuilder.RenameColumn(
                name: "Initiator_UserId",
                table: "Games",
                newName: "initiatorUserId");

            migrationBuilder.CreateTable(
                name: "GameBoards",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("MySql:ValueGeneratedOnAdd", true),
                    answeredCorrectlyUserId = table.Column<string>(nullable: true),
                    boardColumn = table.Column<int>(nullable: false),
                    boardRow = table.Column<int>(nullable: false),
                    gameId = table.Column<int>(nullable: false),
                    questionId = table.Column<int>(nullable: false),
                    questionState = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GameBoards", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "GameCategories",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("MySql:ValueGeneratedOnAdd", true),
                    categoryId = table.Column<int>(nullable: false),
                    gameId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GameCategories", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "GamePlayers",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("MySql:ValueGeneratedOnAdd", true),
                    gameId = table.Column<int>(nullable: false),
                    initiator = table.Column<bool>(nullable: false),
                    userId = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GamePlayers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "GamePlayersEmail",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("MySql:ValueGeneratedOnAdd", true),
                    gameId = table.Column<int>(nullable: false),
                    userEmail = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GamePlayersEmail", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "lastActiveUserId",
                table: "Games",
                newName: "LastActiveUserId");

            migrationBuilder.RenameColumn(
                name: "gameLength",
                table: "Games",
                newName: "GameLength");

            migrationBuilder.RenameColumn(
                name: "activeUserId",
                table: "Games",
                newName: "ActiveUserId");

            migrationBuilder.RenameColumn(
                name: "initiatorUserId",
                table: "Games",
                newName: "Initiator_UserId");

            migrationBuilder.DropTable(
                name: "GameBoards");

            migrationBuilder.DropTable(
                name: "GameCategories");

            migrationBuilder.DropTable(
                name: "GamePlayers");

            migrationBuilder.DropTable(
                name: "GamePlayersEmail");
        }
    }
}
