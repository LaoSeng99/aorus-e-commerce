# Aorus E-Commerce Web

A comprehensive e-commerce platform built with .NET 6, providing a seamless experience for customers, sellers, and administrators.

## Project Overview

Aorus E-Commerce Web is a full-stack web application designed to facilitate online trading. It supports multiple user roles, including Customers who can browse and buy products, Sellers who can manage their inventory, and Administrators who oversee the entire platform.

## Key Features

### For Customers
- **Product Browsing**: Search and filter products by categories.
- **Shopping Cart**: Add products to cart and manage quantities.
- **Secure Checkout**: Integrated with **Stripe** for payment processing.
- **Order History**: Track and view past orders.
- **SMS Notifications**: Integrated with **Twilio** for order updates.
- **Profile Management**: Update personal information and addresses.

### For Sellers
- **Product Management**: Add, edit, and delete products.
- **Inventory Tracking**: Monitor stock levels.
- **Sales Dashboard**: View sales performance and order status.

### For Administrators
- **User Management**: Manage customer and seller accounts.
- **Platform Oversight**: Monitor transactions and system health.

## Technologies Used

- **Backend**: C# .NET 6 Web API / MVC
- **Frontend**: ASP.NET Core MVC (Razor Pages), Bootstrap, jQuery
- **Database**: Microsoft SQL Server
- **ORM**: Entity Framework Core (EF Core)
- **Containerization**: Docker & Docker Compose
- **Third-Party Integrations**:
  - **Stripe**: Payment gateway
  - **Twilio**: SMS service
  - **MailKit/MimeKit**: Email services
  - **Syncfusion**: UI components

## Project Structure

```text
├── DSE207_Assignment_Last/
│   ├── Controllers/        # MVC Controllers
│   ├── Migrations/         # EF Core Database Migrations
│   ├── Models/             # Data Models and DbContext
│   ├── Views/              # Razor Views
│   ├── wwwroot/            # Static assets (CSS, JS, Images)
│   ├── Program.cs          # Application entry point and service configuration
│   └── appsettings.json    # Application configuration
├── Dockerfile              # Docker build instructions
└── docker-compose.yaml     # Multi-container deployment configuration
```

## Setup Instructions

### Prerequisites
- .NET 6 SDK
- SQL Server (LocalDB or full version)
- Docker Desktop (for containerized deployment)

### Local Development Setup

1.  **Clone the Repository**
2.  **Configure `appsettings.json`**
    Update the `ConnectionStrings` and third-party service keys in `DSE207_Assignment_Last/appsettings.json`.
3.  **Apply Migrations**
    ```bash
    dotnet ef database update --project DSE207_Assignment_Last
    ```
4.  **Run the Application**
    ```bash
    dotnet run --project DSE207_Assignment_Last
    ```

### Docker Deployment

To run the entire stack using Docker:

```bash
docker-compose up -d
```
The application will be accessible at `http://localhost:8001`.

## Configuration

Ensure the following settings are configured in `appsettings.json` for full functionality:

- **ConnectionStrings**: SQL Server connection string.
- **StripeSettings**: `SecretKey` and `PublishableKey`.
- **TwilioSettings**: `AccountSID`, `AuthToken`, and `MessagingServiceSID`.
- **EmailSettings**: SMTP server details for sending notifications.
