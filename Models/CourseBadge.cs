using System;
using System.Collections.Generic;

namespace ggeco_api.Models
{
    public partial class CourseBadge
    {
        public Guid Id { get; set; }
        public Guid CourseId { get; set; }
        public Guid BadgeId { get; set; }
    }
}
