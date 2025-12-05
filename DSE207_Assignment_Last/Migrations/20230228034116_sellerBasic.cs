using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DSE207_Assignment_Last.Migrations
{
    public partial class sellerBasic : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "Approval_At",
                table: "Sellers",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "Registered_At",
                table: "Sellers",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Approval_At",
                table: "Sellers");

            migrationBuilder.DropColumn(
                name: "Registered_At",
                table: "Sellers");
        }
    }
}
