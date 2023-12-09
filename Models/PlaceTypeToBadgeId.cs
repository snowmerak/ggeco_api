using System;
using System.Collections.Generic;

namespace ggeco_api.Models
{
    public partial class PlaceTypeToBadgeId
    {
        public Guid Id { get; set; }
        public string PlaceType { get; set; }
        public Guid BadgeId { get; set; }
    }
}
