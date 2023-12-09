using System;
using System.Collections.Generic;

namespace ggeco_api.Models
{
    public partial class Place
    {
        public string Id { get; set; }
        public string Data { get; set; }
        public DateTime? LastUpdate { get; set; }
    }
}
