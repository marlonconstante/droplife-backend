require "sinatra"
require "./src/ruby/orchestrate"

get "/experiencia/pesquisa" do
  Orchestrate.new().search("Experiencia", nil)
end

post "/experiencia/salvar/*" do |key|
  Orchestrate.new().save("Experiencia", key, request.body.read)
end

delete "/experiencia/remover/*" do |key|
  Orchestrate.new().delete("Experiencia", key)
end

get "/cadastro/*/*" do |path, file|
  send_file "src/#{path}/#{file}"
end