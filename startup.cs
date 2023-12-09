using System;
using ggeco_api.Models;
using Microsoft.Azure.Functions.Extensions.DependencyInjection;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

[assembly: FunctionsStartup(typeof(ggeco_api.Startup))]

namespace ggeco_api
{
    public class Startup : FunctionsStartup
    {
        private const string SqlServerDatabase = "SQL_SERVER_DATABASE";
        private const string SqlServerHost = "SQL_SERVER_HOST";
        private const string SqlServerPassword = "SQL_SERVER_PASSWORD";
        private const string SqlServerPort = "SQL_SERVER_PORT";
        private const string SqlServerUser = "SQL_SERVER_USER";

        public override void Configure(IFunctionsHostBuilder builder)
        {
            builder.Services.AddHttpClient();

            var connectionStringBuilder = new SqlConnectionStringBuilder()
            {
                DataSource = Environment.GetEnvironmentVariable(SqlServerDatabase) ?? "block",
                InitialCatalog = Environment.GetEnvironmentVariable(SqlServerHost) ?? "localhost" + ":" + Environment.GetEnvironmentVariable(SqlServerPort) ?? "1433",
                Password = Environment.GetEnvironmentVariable(SqlServerPassword) ?? "password",
                UserID = Environment.GetEnvironmentVariable(SqlServerUser) ?? "sa",
                IntegratedSecurity = false,
            };

            builder.Services.AddDbContext<blockContext>(
                options => options.UseSqlServer(connectionStringBuilder.ConnectionString)
            );
        }
    }
}