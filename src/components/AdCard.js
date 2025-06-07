const AdCard = ({ ad }) => {
  const formatNumber = (num) => {
    return num.toLocaleString();
  };

  const formatCurrency = (num) => {
    return `$${num.toLocaleString()}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900 truncate">
          {ad.campaign}
        </h3>
        <span
          className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
            ad.platform === "Facebook"
              ? "bg-blue-300 text-blue-800"
              : ad.platform === "Twitter"
              ? "bg-black text-white"
              : ad.platform === "Snapchat"
              ? "bg-yellow-400 text-black"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          {ad.platform}
        </span>
      </div>

      <div className="space-y-3">
        <div>
          <span className="text-sm font-medium text-gray-500">Adset:</span>
          <p className="text-sm text-gray-900 mt-1">{ad.adset}</p>
        </div>

        <div>
          <span className="text-sm font-medium text-gray-500">Creative:</span>
          <p className="text-sm text-gray-900 mt-1">{ad.creative}</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            Spend
          </div>
          <div className="text-lg font-semibold text-gray-900 mt-1">
            {formatCurrency(ad.spend)}
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            Impressions
          </div>
          <div className="text-lg font-semibold text-gray-900 mt-1">
            {formatNumber(ad.impressions)}
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            Clicks
          </div>
          <div className="text-lg font-semibold text-gray-900 mt-1">
            {formatNumber(ad.clicks)}
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            Results
          </div>
          <div className="text-lg font-semibold text-gray-900 mt-1">
            {formatNumber(ad.results)}
          </div>
        </div>
      </div>

      {/* Performance indicators */}
      {/* <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex justify-between text-sm">
          <div>
            <span className="text-gray-500">CTR:</span>
            <span className="text-gray-900 ml-1">
              {ad.impressions > 0 ? ((ad.clicks / ad.impressions) * 100).toFixed(2) : '0.00'}%
            </span>
          </div>
          <div>
            <span className="text-gray-500">CPC:</span>
            <span className="text-gray-900 ml-1">
              {ad.clicks > 0 ? formatCurrency(ad.spend / ad.clicks) : '$0.00'}
            </span>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default AdCard;
