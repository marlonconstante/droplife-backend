require "sinatra"
require "orchestrate.io"
require "json"

get "/parceiro/pesquisa/*" do |query|
  @io = OrchestrateIo.new(api_key: "f90dde76-cee4-4524-80f7-77493b6d1f1f:")

  @io.search :get do
    collection "Parceiro"
    query       query
  end.perform

end
