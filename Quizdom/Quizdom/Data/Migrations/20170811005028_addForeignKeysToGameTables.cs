using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Quizdom.Data.Migrations
{
    public partial class addForeignKeysToGameTables : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_GamePlayersEmail_gameId",
                table: "GamePlayersEmail",
                column: "gameId");

            migrationBuilder.CreateIndex(
                name: "IX_GamePlayers_gameId",
                table: "GamePlayers",
                column: "gameId");

            migrationBuilder.CreateIndex(
                name: "IX_GameCategories_gameId",
                table: "GameCategories",
                column: "gameId");

            migrationBuilder.CreateIndex(
                name: "IX_GameBoards_gameId",
                table: "GameBoards",
                column: "gameId");

            migrationBuilder.AddForeignKey(
                name: "FK_GameBoards_Games_gameId",
                table: "GameBoards",
                column: "gameId",
                principalTable: "Games",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_GameCategories_Games_gameId",
                table: "GameCategories",
                column: "gameId",
                principalTable: "Games",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_GamePlayers_Games_gameId",
                table: "GamePlayers",
                column: "gameId",
                principalTable: "Games",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_GamePlayersEmail_Games_gameId",
                table: "GamePlayersEmail",
                column: "gameId",
                principalTable: "Games",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_GameBoards_Games_gameId",
                table: "GameBoards");

            migrationBuilder.DropForeignKey(
                name: "FK_GameCategories_Games_gameId",
                table: "GameCategories");

            migrationBuilder.DropForeignKey(
                name: "FK_GamePlayers_Games_gameId",
                table: "GamePlayers");

            migrationBuilder.DropForeignKey(
                name: "FK_GamePlayersEmail_Games_gameId",
                table: "GamePlayersEmail");

            migrationBuilder.DropIndex(
                name: "IX_GamePlayersEmail_gameId",
                table: "GamePlayersEmail");

            migrationBuilder.DropIndex(
                name: "IX_GamePlayers_gameId",
                table: "GamePlayers");

            migrationBuilder.DropIndex(
                name: "IX_GameCategories_gameId",
                table: "GameCategories");

            migrationBuilder.DropIndex(
                name: "IX_GameBoards_gameId",
                table: "GameBoards");
        }
    }
}
