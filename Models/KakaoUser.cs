using System;
using System.Collections.Generic;

namespace ggeco_api.Models
{
    public partial class KakaoUser
    {
        public Guid UserId { get; set; }
        public long KakaoId { get; set; }
        public string Info { get; set; }
    }
}
