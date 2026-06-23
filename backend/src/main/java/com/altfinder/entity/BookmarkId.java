package com.altfinder.entity;

import java.io.Serializable;
import java.util.Objects;

public class BookmarkId implements Serializable {
    private String userId;
    private String slug;

    public BookmarkId() {}

    public BookmarkId(String userId, String slug) {
        this.userId = userId;
        this.slug = slug;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getSlug() {
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        BookmarkId that = (BookmarkId) o;
        return Objects.equals(userId, that.userId) && Objects.equals(slug, that.slug);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId, slug);
    }
}
