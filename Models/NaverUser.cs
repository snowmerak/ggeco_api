using System;
using System.Collections.Generic;

namespace ggeco_api.Models
{
    public partial class NaverUser
    {
        public Guid UserId { get; set; }
        public string NaverId { get; set; }
        public string Info { get; set; }
    }
}
