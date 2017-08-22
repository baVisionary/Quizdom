using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Quizdom.Data.Migrations
{
    public partial class addedGameColumns : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "gameBoardId",
                table: "Games",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "gameState",
                table: "Games",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "gameBoardId",
                table: "Games");

            migrationBuilder.DropColumn(
                name: "gameState",
                table: "Games");
        }
    }
}
