require "orchestrate.io"

class Orchestrate
  API_KEY = "f90dde76-cee4-4524-80f7-77493b6d1f1f:"

  def initialize
    @io = OrchestrateIo.new(api_key: API_KEY)
  end

  def search(collection, query)
    @io.search :get do
      collection collection
      query query
      limit 100
      offset 0
    end.perform.to_json
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