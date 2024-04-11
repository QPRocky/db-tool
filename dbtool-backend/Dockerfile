FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["DbToolApi/DbToolApi.csproj", "DbToolApi/"]
RUN dotnet restore "DbToolApi/DbToolApi.csproj"
COPY . .
WORKDIR "/src/DbToolApi"
RUN dotnet build "DbToolApi.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "DbToolApi.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "DbToolApi.dll"]