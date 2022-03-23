using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;
using System;
using System.Text.Json.Serialization;

namespace Projekat.Models
{
    public class Reservation
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public DateTime ReservationDate { get; set; }
        
        public Service Service { get; set; }

        public Employer Employer { get; set; }

        [Required]
        [StringLength(255,  MinimumLength = 2)]
        public string Customer { get; set; }

        [JsonIgnore]
        public Salon Salon { get; set; }
    }
}