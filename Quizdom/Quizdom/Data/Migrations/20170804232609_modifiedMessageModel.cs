using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Quizdom.Data.Migrations
{
    public partial class modifiedMessageModel : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Message_AspNetUsers_UserId",
                table: "Message");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "Message",
                newName: "UserName");

            migrationBuilder.DropIndex(
                name: "IX_Message_UserId",
                table: "Message");

            migrationBuilder.DropColumn(
                name: "IsLoggedIn",
                table: "UserActivity");

            migrationBuilder.AlterColumn<string>(
                name: "UserName",
                table: "Message",
                nullable: false,
                oldClrType: typeof(string));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "UserName",
                table: "Message",
                newName: "UserId");

            migrationBuilder.AddColumn<bool>(
                name: "IsLoggedIn",
                table: "UserActivity",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AlterColumn<string>(
                name: "UserId",
                table: "Message",
                nullable: false,
                oldClrType: typeof(string));

            migrationBuilder.CreateIndex(
                name: "IX_Message_UserId",
                table: "Message",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Message_AspNetUsers_UserId",
                table: "Message",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
