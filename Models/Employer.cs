
using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Projekat.Models
{
    public class Employer
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(60, MinimumLength = 2)]
        public string Name { get; set; }

        [Required]
        [StringLength(60, MinimumLength = 2)]
        public string LastName { get; set; }

        [JsonIgnore]
        public Salon Salon { get; set; }



    }
}