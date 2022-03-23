using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.SqlServer;
using Projekat.Models;

namespace Projekat.Models
{
    public class Context : DbContext
    {
        public Context(DbContextOptions options) : base(options)
        { }

        public DbSet<Employer> Employers { get; set; }
        public DbSet<Reservation> Reservations { get; set; }
        public DbSet<Salon> Salons { get; set; }
        public DbSet<Service> Services { get; set; }



    }
}