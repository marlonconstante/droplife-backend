require "orchestrate.io"

class Orchestrate
  API_KEY = "f90dde76-cee4-4524-80f7-77493b6d1f1f:"

  def initialize
    @io = OrchestrateIo.new(:api_key => API_KEY)
  end

  def load(collection, key)
    @io.key_value :get do
      collection collection
      key key
    end.perform.to_json
  end

  def search(collection, query)
    limit = 100
    offset = 0

    originalResult = paginatedSearch(collection, query, limit, offset)

    while (originalResult["total_count"] > originalResult["count"])
      offset += limit

      result = paginatedSearch(collection, query, limit, offset)

      originalResult["results"].concat result["results"];
      originalResult["count"] += result["count"]
    end

    originalResult.to_json
  end

  def paginatedSearch(collection, query, limit, offset)
    @io.search :get do
      collection collection
      query query
      limit limit
      offset offset
    end.perform
  end

  def save(collection, key, data)
    @io.key_value :put do
      collection collection
      key key
      data data
    end.perform
  end

  def delete(collection, key)
    @io.key_value :delete do
      collection collection
      key key
    end.perform
  end

end