require "sinatra"
require "./src/ruby/orchestrate"

get "/parceiro/pesquisa/*" do |query|
  Orchestrate.new().search("Parceiro", query)
end

get "/cadastro" do
  send_file "src/views/html/cadastro.html"
end
