using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Quizdom.Data.Migrations
{
    public partial class addedGameTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Games",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("MySql:ValueGeneratedOnAdd", true),
                    ActiveUserId = table.Column<string>(nullable: true),
                    Categories = table.Column<string>(nullable: true),
                    GameLength = table.Column<int>(nullable: true),
                    Initiator_UserId = table.Column<string>(nullable: true),
                    InvitedUserEmails = table.Column<string>(nullable: true),
                    LastActiveUserId = table.Column<string>(nullable: true),
                    Players = table.Column<string>(nullable: true),
                    Questions = table.Column<string>(nullable: true),
                    QuestionsState = table.Column<string>(nullable: true),
                    startDateTime = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Games", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Games");
        }
    }
}
