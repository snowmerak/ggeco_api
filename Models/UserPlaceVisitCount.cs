using System;
using System.Collections.Generic;

namespace ggeco_api.Models
{
    public partial class UserPlaceVisitCount
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string PlaceType { get; set; }
        public long Count { get; set; }
    }
}
