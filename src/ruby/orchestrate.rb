require "orchestrate.io"
require "json"

class Orchestrate
  API_KEY = "f90dde76-cee4-4524-80f7-77493b6d1f1f:"

  def initialize
    @io = OrchestrateIo.new(api_key: API_KEY)
  end

  def search(collection, query)
    @io.search :get do
      collection collection
      query query
    end.perform
  end

end