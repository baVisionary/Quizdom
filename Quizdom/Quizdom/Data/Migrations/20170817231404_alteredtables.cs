using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Quizdom.Data.Migrations
{
    public partial class alteredtables : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "answer",
                table: "GamePlayers",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "delay",
                table: "GamePlayers",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AlterColumn<int>(
                name: "correctAnswer",
                table: "GameBoards",
                nullable: false,
                oldClrType: typeof(string),
                oldNullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "answer",
                table: "GamePlayers");

            migrationBuilder.DropColumn(
                name: "delay",
                table: "GamePlayers");

            migrationBuilder.AlterColumn<string>(
                name: "correctAnswer",
                table: "GameBoards",
                nullable: true,
                oldClrType: typeof(int));
        }
    }
}
