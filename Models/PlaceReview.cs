using System;
using System.Collections.Generic;

namespace ggeco_api.Models
{
    public partial class PlaceReview
    {
        public Guid Id { get; set; }
        public string PlaceId { get; set; }
        public Guid CourseId { get; set; }
        public Guid AuthorId { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public string Review { get; set; }
        public int Order { get; set; }
    }
}
