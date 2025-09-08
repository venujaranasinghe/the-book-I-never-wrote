using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace thebook.api.Migrations
{
    /// <inheritdoc />
    public partial class UpdateChaptersTableSchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Rename existing columns to match our model
            migrationBuilder.RenameColumn(
                name: "Description",
                table: "Chapters",
                newName: "Subtitle");
                
            migrationBuilder.RenameColumn(
                name: "ChapterNumber",
                table: "Chapters",
                newName: "Order");
                
            migrationBuilder.RenameColumn(
                name: "IsPublished",
                table: "Chapters",
                newName: "IsActive");

            // Modify existing columns
            migrationBuilder.AlterColumn<string>(
                name: "Subtitle",
                table: "Chapters",
                type: "varchar(300)",
                maxLength: 300,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(1000)",
                oldMaxLength: 1000,
                oldNullable: true)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            // Add new columns
            migrationBuilder.AddColumn<string>(
                name: "Year",
                table: "Chapters",
                type: "varchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "")
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Content",
                table: "Chapters",
                type: "longtext",
                nullable: false,
                defaultValue: "")
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Footnotes",
                table: "Chapters",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            // Add foreign key constraint if it doesn't exist
            migrationBuilder.CreateIndex(
                name: "IX_Chapters_UserId_Order",
                table: "Chapters",
                columns: new[] { "UserId", "Order" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Drop new columns
            migrationBuilder.DropColumn(
                name: "Year",
                table: "Chapters");

            migrationBuilder.DropColumn(
                name: "Content",
                table: "Chapters");

            migrationBuilder.DropColumn(
                name: "Footnotes",
                table: "Chapters");

            // Drop index
            migrationBuilder.DropIndex(
                name: "IX_Chapters_UserId_Order",
                table: "Chapters");

            // Rename columns back to original names
            migrationBuilder.RenameColumn(
                name: "Subtitle",
                table: "Chapters",
                newName: "Description");
                
            migrationBuilder.RenameColumn(
                name: "Order",
                table: "Chapters",
                newName: "ChapterNumber");
                
            migrationBuilder.RenameColumn(
                name: "IsActive",
                table: "Chapters",
                newName: "IsPublished");

            // Revert column changes
            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "Chapters",
                type: "varchar(1000)",
                maxLength: 1000,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(300)",
                oldMaxLength: 300,
                oldNullable: true)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");
        }
    }
}
