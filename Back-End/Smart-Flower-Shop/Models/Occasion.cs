using System.ComponentModel.DataAnnotations;

namespace Smart_Flower_Shop.Models
{
    public class Occasion
    {
        [Key]
        public int OccasionId { get; set; }

        [Required]
        [MaxLength(50)]
        public string Name { get; set; }
    }
}
