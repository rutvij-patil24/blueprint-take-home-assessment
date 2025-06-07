const API_BASE_URL = "http://localhost:3000";

export class DataService {
  static async fetchRawData() {
    const response = await fetch(`${API_BASE_URL}/fakeDataSet`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  static standardizeFacebookAd(ad, platform = "Facebook") {
    return {
      id: `${platform}-${ad.campaign_name}-${ad.media_buy_name}-${ad.ad_name}`,
      campaign: ad.campaign_name,
      adset: ad.media_buy_name,
      creative: ad.ad_name,
      spend: ad.spend,
      impressions: ad.impressions,
      clicks: ad.clicks,
      results: 0,
      platform,
    };
  }

  static standardizeTwitterAd(ad, platform = "Twitter") {
    return {
      id: `${platform}-${ad.campaign}-${ad.ad_group}-${ad.image_name}`,
      campaign: ad.campaign,
      adset: ad.ad_group,
      creative: ad.image_name,
      spend: ad.spend,
      impressions: ad.impressions,
      clicks: ad.post_clicks,
      results: 0,
      platform,
    };
  }

  static standardizeSnapchatAd(ad, platform = "Snapchat") {
    const normalizeAdset = (adsetName) => {
      if (adsetName === "Social Media Squad") return "Social Media Ads";
      if (adsetName === "Display Ads Squad") return "Display Ads";
      if (adsetName === "Search Ads Squad") return "Search Ads";
      return adsetName;
    };

    return {
      id: `${platform}-${ad.campaign_name}-${ad.ad_squad_name}-${ad.creative_name}`,
      campaign: ad.campaign_name,
      adset: normalizeAdset(ad.ad_squad_name),
      creative: ad.creative_name,
      spend: ad.cost,
      impressions: ad.impressions,
      clicks: ad.post_clicks,
      results: 0,
      platform,
    };
  }

  static createExactLookupKey(campaign, adset, creative) {
    return `${campaign}-${adset}-${creative}`.toLowerCase();
  }

  static createFuzzyLookupKey(campaign, adset, creative) {
    const normalizeCreative = (str) => {
      return str
        .toLowerCase()

        .replace(
          /\b(promo|promotion|deal|deals|sale|sales|offer|special|specials)\b/g,
          ""
        )

        .replace(/\b(new|fresh|latest|update|best|top|hot|vacation)\b/g, "")

        .replace(/\b(essentials|trends|fall)\b/g, "")

        .replace(/\s+/g, " ")
        .trim();
    };

    const normalizedCreative = normalizeCreative(creative);
    return `${campaign}-${adset}-${normalizedCreative}`.toLowerCase();
  }

  static processGoogleAnalytics(gaData) {
    const exactResultsMap = new Map();
    const fuzzyResultsMap = new Map();

    gaData.forEach((ga) => {
      const exactKey = this.createExactLookupKey(
        ga.utm_campaign,
        ga.utm_medium,
        ga.utm_content
      );
      const currentExactResults = exactResultsMap.get(exactKey) || 0;
      exactResultsMap.set(exactKey, currentExactResults + ga.results);

      const fuzzyKey = this.createFuzzyLookupKey(
        ga.utm_campaign,
        ga.utm_medium,
        ga.utm_content
      );
      const currentFuzzyResults = fuzzyResultsMap.get(fuzzyKey) || 0;
      fuzzyResultsMap.set(fuzzyKey, currentFuzzyResults + ga.results);
    });

    return { exactResultsMap, fuzzyResultsMap };
  }

  static findBestMatch(platformAd, exactResultsMap, fuzzyResultsMap) {
    const exactKey = this.createExactLookupKey(
      platformAd.campaign,
      platformAd.adset,
      platformAd.creative
    );
    if (exactResultsMap.has(exactKey)) {
      return exactResultsMap.get(exactKey);
    }

    const fuzzyKey = this.createFuzzyLookupKey(
      platformAd.campaign,
      platformAd.adset,
      platformAd.creative
    );
    if (fuzzyResultsMap.has(fuzzyKey)) {
      return fuzzyResultsMap.get(fuzzyKey);
    }

    return 0;
  }

  static async getStandardizedAds() {
    try {
      const rawData = await this.fetchRawData();

      const standardizedAds = [
        ...rawData.facebook_ads.map((ad) => this.standardizeFacebookAd(ad)),
        ...rawData.twitter_ads.map((ad) => this.standardizeTwitterAd(ad)),
        ...rawData.snapchat_ads.map((ad) => this.standardizeSnapchatAd(ad)),
      ];

      const { exactResultsMap, fuzzyResultsMap } = this.processGoogleAnalytics(
        rawData.google_analytics
      );

      standardizedAds.forEach((ad) => {
        ad.results = this.findBestMatch(ad, exactResultsMap, fuzzyResultsMap);
      });

      return standardizedAds;
    } catch (error) {
      console.error("Error fetching or processing data:", error);
      throw error;
    }
  }

  static filterAdsByCampaign(ads, searchTerm) {
    if (!searchTerm.trim()) return ads;

    const lowerSearchTerm = searchTerm.toLowerCase();
    return ads.filter((ad) =>
      ad.campaign.toLowerCase().includes(lowerSearchTerm)
    );
  }

  static sortAdsBySpend(ads, direction) {
    if (!direction) return ads;

    return [...ads].sort((a, b) => {
      if (direction === "asc") {
        return a.spend - b.spend;
      } else {
        return b.spend - a.spend;
      }
    });
  }
}
