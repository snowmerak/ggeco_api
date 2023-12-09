using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace ggeco_api.Models
{
    public partial class blockContext : DbContext
    {
        private readonly string _connectionString;

        public blockContext(string connectionString)
        {
            _connectionString = connectionString;
        }

        public blockContext(DbContextOptions<blockContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Badge> Badges { get; set; }
        public virtual DbSet<BadgeRank> BadgeRanks { get; set; }
        public virtual DbSet<Course> Courses { get; set; }
        public virtual DbSet<CourseBadge> CourseBadges { get; set; }
        public virtual DbSet<CoursePlace> CoursePlaces { get; set; }
        public virtual DbSet<EarnedBadge> EarnedBadges { get; set; }
        public virtual DbSet<FavoriteCourse> FavoriteCourses { get; set; }
        public virtual DbSet<FavoritePlace> FavoritePlaces { get; set; }
        public virtual DbSet<KakaoUser> KakaoUsers { get; set; }
        public virtual DbSet<NaverUser> NaverUsers { get; set; }
        public virtual DbSet<Place> Places { get; set; }
        public virtual DbSet<PlaceReview> PlaceReviews { get; set; }
        public virtual DbSet<PlaceReviewPicture> PlaceReviewPictures { get; set; }
        public virtual DbSet<PlaceTypeToBadgeId> PlaceTypeToBadgeIds { get; set; }
        public virtual DbSet<User> Users { get; set; }
        public virtual DbSet<UserPlaceVisitCount> UserPlaceVisitCounts { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured) {
                optionsBuilder.UseSqlServer(_connectionString);
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Badge>(entity =>
            {
                entity.Property(e => e.Id)
                    .HasColumnName("id")
                    .HasDefaultValueSql("(newid())");

                entity.Property(e => e.ActiveImage)
                    .IsRequired()
                    .IsUnicode(false)
                    .HasColumnName("active_image");

                entity.Property(e => e.InactiveImage)
                    .IsRequired()
                    .IsUnicode(false)
                    .HasColumnName("inactive_image");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasColumnName("name");

                entity.Property(e => e.Searchable).HasColumnName("searchable");

                entity.Property(e => e.SelectedImage)
                    .IsRequired()
                    .IsUnicode(false)
                    .HasColumnName("selected_image");

                entity.Property(e => e.Summary)
                    .IsRequired()
                    .HasColumnName("summary");
            });

            modelBuilder.Entity<BadgeRank>(entity =>
            {
                entity.HasKey(e => e.UserId);

                entity.ToTable("BadgeRank");

                entity.Property(e => e.UserId)
                    .ValueGeneratedNever()
                    .HasColumnName("user_id");

                entity.Property(e => e.CurrentRank).HasColumnName("current_rank");

                entity.Property(e => e.PrevRank).HasColumnName("prev_rank");

                entity.Property(e => e.UpdateAt).HasColumnName("update_at");
            });

            modelBuilder.Entity<Course>(entity =>
            {
                entity.HasIndex(e => new { e.AuthorId, e.RegDate }, "Index_author_date");

                entity.HasIndex(e => e.AuthorId, "index_author");

                entity.Property(e => e.Id)
                    .HasColumnName("id")
                    .HasDefaultValueSql("(newid())");

                entity.Property(e => e.AuthorId).HasColumnName("author_id");

                entity.Property(e => e.IsPublic)
                    .HasColumnName("is_public")
                    .HasDefaultValueSql("((1))");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(40)
                    .HasColumnName("name")
                    .IsFixedLength();

                entity.Property(e => e.RegDate).HasColumnName("reg_date");

                entity.Property(e => e.Review)
                    .IsRequired()
                    .HasColumnName("review");
            });

            modelBuilder.Entity<CourseBadge>(entity =>
            {
                entity.HasIndex(e => e.CourseId, "Index_course_id");

                entity.HasIndex(e => e.BadgeId, "Index_keyword");

                entity.Property(e => e.Id)
                    .HasColumnName("id")
                    .HasDefaultValueSql("(newid())");

                entity.Property(e => e.BadgeId).HasColumnName("badge_id");

                entity.Property(e => e.CourseId).HasColumnName("course_id");
            });

            modelBuilder.Entity<CoursePlace>(entity =>
            {
                entity.HasIndex(e => e.CourseId, "Index_course_id");

                entity.HasIndex(e => e.PlaceId, "Index_place_id");

                entity.Property(e => e.Id)
                    .HasColumnName("id")
                    .HasDefaultValueSql("(newid())");

                entity.Property(e => e.CourseId).HasColumnName("course_id");

                entity.Property(e => e.Order).HasColumnName("order");

                entity.Property(e => e.PlaceId)
                    .IsRequired()
                    .HasMaxLength(4096)
                    .IsUnicode(false)
                    .HasColumnName("place_id");
            });

            modelBuilder.Entity<EarnedBadge>(entity =>
            {
                entity.HasIndex(e => e.BadgeId, "Index_badge_id");

                entity.HasIndex(e => e.UserId, "index_user_id");

                entity.Property(e => e.Id)
                    .HasColumnName("id")
                    .HasDefaultValueSql("(newid())");

                entity.Property(e => e.BadgeId).HasColumnName("badge_id");

                entity.Property(e => e.EarnedAt).HasColumnName("earned_at");

                entity.Property(e => e.UserId).HasColumnName("user_id");
            });

            modelBuilder.Entity<FavoriteCourse>(entity =>
            {
                entity.HasIndex(e => e.CourseId, "Index_course_id");

                entity.HasIndex(e => e.UserId, "index_user_id");

                entity.Property(e => e.Id)
                    .HasColumnName("id")
                    .HasDefaultValueSql("(newid())");

                entity.Property(e => e.CourseId).HasColumnName("course_id");

                entity.Property(e => e.RegisteredAt).HasColumnName("registered_at");

                entity.Property(e => e.UserId).HasColumnName("user_id");
            });

            modelBuilder.Entity<FavoritePlace>(entity =>
            {
                entity.HasIndex(e => e.PlaceId, "Index_place_id");

                entity.HasIndex(e => e.UserId, "index_user_id");

                entity.Property(e => e.Id)
                    .HasColumnName("id")
                    .HasDefaultValueSql("(newid())");

                entity.Property(e => e.PlaceId)
                    .IsRequired()
                    .HasMaxLength(4096)
                    .IsUnicode(false)
                    .HasColumnName("place_id");

                entity.Property(e => e.RegisteredAt).HasColumnName("registered_at");

                entity.Property(e => e.UserId).HasColumnName("user_id");
            });

            modelBuilder.Entity<KakaoUser>(entity =>
            {
                entity.HasKey(e => e.UserId);

                entity.HasIndex(e => e.KakaoId, "index_kakao_id");

                entity.Property(e => e.UserId)
                    .ValueGeneratedNever()
                    .HasColumnName("user_id");

                entity.Property(e => e.Info)
                    .IsRequired()
                    .HasColumnType("ntext")
                    .HasColumnName("info");

                entity.Property(e => e.KakaoId).HasColumnName("kakao_id");
            });

            modelBuilder.Entity<NaverUser>(entity =>
            {
                entity.HasKey(e => e.UserId);

                entity.HasIndex(e => e.NaverId, "index_naver_id");

                entity.Property(e => e.UserId)
                    .ValueGeneratedNever()
                    .HasColumnName("user_id");

                entity.Property(e => e.Info)
                    .IsRequired()
                    .HasColumnType("ntext")
                    .HasColumnName("info");

                entity.Property(e => e.NaverId)
                    .IsRequired()
                    .HasMaxLength(128)
                    .IsUnicode(false)
                    .HasColumnName("naver_id")
                    .IsFixedLength();
            });

            modelBuilder.Entity<Place>(entity =>
            {
                entity.Property(e => e.Id)
                    .HasMaxLength(4096)
                    .IsUnicode(false)
                    .HasColumnName("id");

                entity.Property(e => e.Data).HasColumnName("data");

                entity.Property(e => e.LastUpdate).HasColumnName("last_update");
            });

            modelBuilder.Entity<PlaceReview>(entity =>
            {
                entity.HasIndex(e => e.AuthorId, "Index_author_id");

                entity.HasIndex(e => e.CourseId, "Index_course_id");

                entity.Property(e => e.Id)
                    .HasColumnName("id")
                    .HasDefaultValueSql("(newid())");

                entity.Property(e => e.AuthorId).HasColumnName("author_id");

                entity.Property(e => e.CourseId).HasColumnName("course_id");

                entity.Property(e => e.Latitude).HasColumnName("latitude");

                entity.Property(e => e.Longitude).HasColumnName("longitude");

                entity.Property(e => e.Order).HasColumnName("order");

                entity.Property(e => e.PlaceId)
                    .IsRequired()
                    .HasMaxLength(4096)
                    .IsUnicode(false)
                    .HasColumnName("place_id");

                entity.Property(e => e.Review)
                    .IsRequired()
                    .HasColumnName("review");
            });

            modelBuilder.Entity<PlaceReviewPicture>(entity =>
            {
                entity.Property(e => e.Id)
                    .HasColumnName("id")
                    .HasDefaultValueSql("(newid())");

                entity.Property(e => e.Order).HasColumnName("order");

                entity.Property(e => e.PictureUrl)
                    .IsRequired()
                    .IsUnicode(false)
                    .HasColumnName("picture_url");

                entity.Property(e => e.ReviewId).HasColumnName("review_id");

                entity.Property(e => e.ThumbnailUrl)
                    .IsUnicode(false)
                    .HasColumnName("thumbnail_url");
            });

            modelBuilder.Entity<PlaceTypeToBadgeId>(entity =>
            {
                entity.ToTable("PlaceTypeToBadgeId");

                entity.HasIndex(e => e.PlaceType, "PlaceType_index");

                entity.Property(e => e.Id)
                    .HasColumnName("id")
                    .HasDefaultValueSql("(newid())");

                entity.Property(e => e.BadgeId).HasColumnName("badge_id");

                entity.Property(e => e.PlaceType)
                    .IsRequired()
                    .HasMaxLength(64)
                    .HasColumnName("place_type");
            });

            modelBuilder.Entity<User>(entity =>
            {
                entity.Property(e => e.Id)
                    .HasColumnName("id")
                    .HasDefaultValueSql("(newid())");

                entity.Property(e => e.Age).HasColumnName("age");

                entity.Property(e => e.Badge)
                    .HasColumnName("badge")
                    .HasDefaultValueSql("('cd0cdf99-d0cf-42b9-b7f9-967592f5332d')");

                entity.Property(e => e.CreateAt).HasColumnName("create_at");

                entity.Property(e => e.Gender).HasColumnName("gender");

                entity.Property(e => e.LastSignin).HasColumnName("last_signin");

                entity.Property(e => e.Nickname)
                    .IsRequired()
                    .HasMaxLength(18)
                    .HasColumnName("nickname")
                    .IsFixedLength();

                entity.Property(e => e.RemovedAt).HasColumnName("removed_at");
            });

            modelBuilder.Entity<UserPlaceVisitCount>(entity =>
            {
                entity.ToTable("UserPlaceVisitCount");

                entity.HasIndex(e => new { e.UserId, e.PlaceType }, "search");

                entity.Property(e => e.Id)
                    .HasColumnName("id")
                    .HasDefaultValueSql("(newid())");

                entity.Property(e => e.Count).HasColumnName("count");

                entity.Property(e => e.PlaceType)
                    .IsRequired()
                    .HasMaxLength(60)
                    .HasColumnName("place_type");

                entity.Property(e => e.UserId).HasColumnName("user_id");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
