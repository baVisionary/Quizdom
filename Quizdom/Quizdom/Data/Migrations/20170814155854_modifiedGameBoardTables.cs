using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Quizdom.Data.Migrations
{
    public partial class modifiedGameBoardTables : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "prizePoints",
                table: "GamePlayers",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "answerA",
                table: "GameBoards",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "answerB",
                table: "GameBoards",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "answerC",
                table: "GameBoards",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "answerD",
                table: "GameBoards",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "answerOrder",
                table: "GameBoards",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "categoryId",
                table: "GameBoards",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "correctAnswer",
                table: "GameBoards",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "difficulty",
                table: "GameBoards",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "prizePoints",
                table: "GameBoards",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "questionText",
                table: "GameBoards",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "prizePoints",
                table: "GamePlayers");

            migrationBuilder.DropColumn(
                name: "answerA",
                table: "GameBoards");

            migrationBuilder.DropColumn(
                name: "answerB",
                table: "GameBoards");

            migrationBuilder.DropColumn(
                name: "answerC",
                table: "GameBoards");

            migrationBuilder.DropColumn(
                name: "answerD",
                table: "GameBoards");

            migrationBuilder.DropColumn(
                name: "answerOrder",
                table: "GameBoards");

            migrationBuilder.DropColumn(
                name: "categoryId",
                table: "GameBoards");

            migrationBuilder.DropColumn(
                name: "correctAnswer",
                table: "GameBoards");

            migrationBuilder.DropColumn(
                name: "difficulty",
                table: "GameBoards");

            migrationBuilder.DropColumn(
                name: "prizePoints",
                table: "GameBoards");

            migrationBuilder.DropColumn(
                name: "questionText",
                table: "GameBoards");
        }
    }
}
