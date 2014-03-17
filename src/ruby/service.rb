require "sinatra"
require "./src/ruby/security"
require "./src/ruby/orchestrate"
require "./src/ruby/voucher"

get "/experiencia/pesquisa" do
  protected!
  Orchestrate.new().search("Experiencia", nil)
end

post "/experiencia/salvar/*" do |key|
  protected!
  Orchestrate.new().save("Experiencia", key, request.body.read)
end

delete "/experiencia/remover/*" do |key|
  protected!
  Orchestrate.new().delete("Experiencia", key)
end

get "/voucher" do
  protected!
  Voucher.new().generate();
end

get "/cadastro/*/*" do |path, file|
  protected!
  send_file "src/#{path}/#{file}"
end