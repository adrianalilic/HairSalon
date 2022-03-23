using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Projekat.Models
{
    public class Salon
    {
        [Key]

        public int Id { get; set; }

        [Required]
        [StringLength(60,  MinimumLength = 2)]
        public string Name { get; set; }

        public List<Reservation> Reservations { get; set; }

        public List<Service> Services { get; set; }

        public List<Employer> Employers { get; set; }


    }
}