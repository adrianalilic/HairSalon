
using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Projekat.Models
{
    public class Service
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(60,  MinimumLength = 2)]
        public string Name { get; set; }

         [JsonIgnore]
        public Salon Salon { get; set; }


    }
}