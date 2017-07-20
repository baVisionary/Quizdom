using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Quizdom.Data.Migrations
{
    public partial class modifiedGameTableForRelationalGamePlay : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Categories",
                table: "Games");

            migrationBuilder.DropColumn(
                name: "InvitedUserEmails",
                table: "Games");

            migrationBuilder.DropColumn(
                name: "Players",
                table: "Games");

            migrationBuilder.DropColumn(
                name: "Questions",
                table: "Games");

            migrationBuilder.DropColumn(
                name: "QuestionsState",
                table: "Games");

            migrationBuilder.AlterColumn<int>(
                name: "GameLength",
                table: "Games",
                nullable: false,
                oldClrType: typeof(int),
                oldNullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Categories",
                table: "Games",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "InvitedUserEmails",
                table: "Games",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Players",
                table: "Games",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Questions",
                table: "Games",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "QuestionsState",
                table: "Games",
                nullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "GameLength",
                table: "Games",
                nullable: true,
                oldClrType: typeof(int));
        }
    }
}
