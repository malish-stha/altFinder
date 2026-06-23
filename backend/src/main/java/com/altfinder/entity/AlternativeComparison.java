package com.altfinder.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "alternative_comparison")
public class AlternativeComparison {

    @Id
    @Column(name = "slug", nullable = false, unique = true)
    private String slug;

    @Column(name = "commercial_name", nullable = false)
    private String commercialName;

    @Column(name = "alternative_name", nullable = false)
    private String alternativeName;

    @Column(name = "category", nullable = false)
    private String category;

    @Column(name = "commercial_description", columnDefinition = "TEXT")
    private String commercialDescription;

    @Column(name = "alternative_description", columnDefinition = "TEXT")
    private String alternativeDescription;

    @Column(name = "features_table_json", columnDefinition = "TEXT")
    private String featuresTableJson;

    @Column(name = "pros_json", columnDefinition = "TEXT")
    private String prosJson;

    @Column(name = "cons_json", columnDefinition = "TEXT")
    private String consJson;

    @Column(name = "why_switch_text", columnDefinition = "TEXT")
    private String whySwitchText;

    @Column(name = "commercial_website")
    private String commercialWebsite;

    @Column(name = "alternative_website")
    private String alternativeWebsite;

    @Column(name = "alternative_repo")
    private String alternativeRepo;

    @Column(name = "commercial_price_numeric")
    private Double commercialPriceNumeric = 0.0;

    @Column(name = "commercial_price_period")
    private String commercialPricePeriod = "monthly"; // monthly or yearly

    @Column(name = "upvote_count")
    private Integer upvoteCount = 0;

    @Column(name = "seo_title")
    private String seoTitle;

    @Column(name = "seo_description", columnDefinition = "TEXT")
    private String seoDescription;

    // Constructors
    public AlternativeComparison() {}

    public AlternativeComparison(String slug, String commercialName, String alternativeName, String category) {
        this.slug = slug;
        this.commercialName = commercialName;
        this.alternativeName = alternativeName;
        this.category = category;
    }

    // Getters and Setters
    public String getSlug() {
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }

    public String getCommercialName() {
        return commercialName;
    }

    public void setCommercialName(String commercialName) {
        this.commercialName = commercialName;
    }

    public String getAlternativeName() {
        return alternativeName;
    }

    public void setAlternativeName(String alternativeName) {
        this.alternativeName = alternativeName;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getCommercialDescription() {
        return commercialDescription;
    }

    public void setCommercialDescription(String commercialDescription) {
        this.commercialDescription = commercialDescription;
    }

    public String getAlternativeDescription() {
        return alternativeDescription;
    }

    public void setAlternativeDescription(String alternativeDescription) {
        this.alternativeDescription = alternativeDescription;
    }

    public String getFeaturesTableJson() {
        return featuresTableJson;
    }

    public void setFeaturesTableJson(String featuresTableJson) {
        this.featuresTableJson = featuresTableJson;
    }

    public String getProsJson() {
        return prosJson;
    }

    public void setProsJson(String prosJson) {
        this.prosJson = prosJson;
    }

    public String getConsJson() {
        return consJson;
    }

    public void setConsJson(String consJson) {
        this.consJson = consJson;
    }

    public String getWhySwitchText() {
        return whySwitchText;
    }

    public void setWhySwitchText(String whySwitchText) {
        this.whySwitchText = whySwitchText;
    }

    public String getCommercialWebsite() {
        return commercialWebsite;
    }

    public void setCommercialWebsite(String commercialWebsite) {
        this.commercialWebsite = commercialWebsite;
    }

    public String getAlternativeWebsite() {
        return alternativeWebsite;
    }

    public void setAlternativeWebsite(String alternativeWebsite) {
        this.alternativeWebsite = alternativeWebsite;
    }

    public String getAlternativeRepo() {
        return alternativeRepo;
    }

    public void setAlternativeRepo(String alternativeRepo) {
        this.alternativeRepo = alternativeRepo;
    }

    public Double getCommercialPriceNumeric() {
        return commercialPriceNumeric;
    }

    public void setCommercialPriceNumeric(Double commercialPriceNumeric) {
        this.commercialPriceNumeric = commercialPriceNumeric;
    }

    public String getCommercialPricePeriod() {
        return commercialPricePeriod;
    }

    public void setCommercialPricePeriod(String commercialPricePeriod) {
        this.commercialPricePeriod = commercialPricePeriod;
    }

    public Integer getUpvoteCount() {
        return upvoteCount;
    }

    public void setUpvoteCount(Integer upvoteCount) {
        this.upvoteCount = upvoteCount;
    }

    public String getSeoTitle() {
        return seoTitle;
    }

    public void setSeoTitle(String seoTitle) {
        this.seoTitle = seoTitle;
    }

    public String getSeoDescription() {
        return seoDescription;
    }

    public void setSeoDescription(String seoDescription) {
        this.seoDescription = seoDescription;
    }
}
