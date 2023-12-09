using System;
using System.Collections.Generic;

namespace ggeco_api.Models
{
    public partial class Badge
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Summary { get; set; }
        public string ActiveImage { get; set; }
        public string InactiveImage { get; set; }
        public string SelectedImage { get; set; }
        public byte Searchable { get; set; }
    }
}
