using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Quizdom.Data.Migrations
{
    public partial class addedquiztable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Quiz",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("MySql:ValueGeneratedOnAdd", true),
                    Category = table.Column<string>(nullable: true),
                    Correct_Answer = table.Column<string>(nullable: true),
                    Difficulty = table.Column<string>(nullable: true),
                    Incorrect_Answer1 = table.Column<string>(nullable: true),
                    Incorrect_Answer2 = table.Column<string>(nullable: true),
                    Incorrect_Answer3 = table.Column<string>(nullable: true),
                    Incorrect_Answer4 = table.Column<string>(nullable: true),
                    Question = table.Column<string>(nullable: true),
                    Type = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Quiz", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Quiz");
        }
    }
}
