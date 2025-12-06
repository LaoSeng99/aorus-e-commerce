#See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["DSE207_Assignment_Last/DSE207_Assignment_Last.csproj", "DSE207_Assignment_Last/"]
RUN dotnet restore "./DSE207_Assignment_Last/./DSE207_Assignment_Last.csproj"
COPY . .
WORKDIR "/src/DSE207_Assignment_Last"
RUN dotnet build "./DSE207_Assignment_Last.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./DSE207_Assignment_Last.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "DSE207_Assignment_Last.dll"]