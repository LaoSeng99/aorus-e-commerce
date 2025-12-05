using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DSE207_Assignment_Last.Migrations
{
    public partial class histroyCreate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "HistoryCreated_At",
                table: "RecentlySearch",
                type: "datetime2",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "HistoryCreated_At",
                table: "RecentlySearch");
        }
    }
}
