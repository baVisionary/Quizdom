using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Quizdom.Data.Migrations
{
    public partial class playerStats : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "PlayerStats",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("MySql:ValueGeneratedOnAdd", true),
                    questionsRight = table.Column<int>(nullable: false),
                    questionsRightDelay = table.Column<int>(nullable: false),
                    questionsWon = table.Column<int>(nullable: false),
                    userName = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PlayerStats", x => x.Id);
                });

            migrationBuilder.AddColumn<int>(
                name: "answerDelay",
                table: "Quiz",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "answeredCorrectly",
                table: "Quiz",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "askedInGame",
                table: "Quiz",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "questionsRight",
                table: "GamePlayers",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "questionsRightDelay",
                table: "GamePlayers",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "questionsWon",
                table: "GamePlayers",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "answeredCorrectlyDelay",
                table: "GameBoards",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "answerDelay",
                table: "Quiz");

            migrationBuilder.DropColumn(
                name: "answeredCorrectly",
                table: "Quiz");

            migrationBuilder.DropColumn(
                name: "askedInGame",
                table: "Quiz");

            migrationBuilder.DropColumn(
                name: "questionsRight",
                table: "GamePlayers");

            migrationBuilder.DropColumn(
                name: "questionsRightDelay",
                table: "GamePlayers");

            migrationBuilder.DropColumn(
                name: "questionsWon",
                table: "GamePlayers");

            migrationBuilder.DropColumn(
                name: "answeredCorrectlyDelay",
                table: "GameBoards");

            migrationBuilder.DropTable(
                name: "PlayerStats");
        }
    }
}
