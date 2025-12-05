using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DSE207_Assignment_Last.Migrations
{
    public partial class productRemove : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "isRemoved",
                table: "Products",
                type: "bit",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "isRemoved",
                table: "Products");
        }
    }
}
