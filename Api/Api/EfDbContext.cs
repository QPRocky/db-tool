using Microsoft.EntityFrameworkCore;

namespace Api;

public class EfDbContext: DbContext
{
    public EfDbContext(DbContextOptions<EfDbContext> options) : base(options)
    {

    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        // optionsBuilder.UseSqlServer(ConnectionString);
        optionsBuilder.UseSqlServer(@"Server=(localdb)\mssqllocaldb;Database=SPAv2_master;Trusted_Connection=True;");
    }

    public DbSet<Transaction> Transactions { get; set; }

    public class Transaction
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }
}
